import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { getWeekOfDate, Pageable } from 'core/utils';
import { Repository } from 'typeorm';
import { MovementEntity } from 'app/movement/entities';
import {
  CreateMovementDto,
  UpdateMovementDto,
  MovementQueryDto,
  GroupMovementDto,
  MovementDto,
} from 'app/movement/dto';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';
import { classToPlain } from 'class-transformer';
import { DateTime } from 'luxon';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MovementEvents } from 'app/movement/types';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(SubcategoryEntity)
    private subcategoryRepository: Repository<SubcategoryEntity>,

    @InjectMapper() private mapper: Mapper,

    private eventEmitter: EventEmitter2,
  ) {}

  async create({
    category,
    subcategory,
    ...rest
  }: CreateMovementDto): Promise<MovementEntity> {
    const categoryEntity = await this.categoryRepository
      .findOneOrFail(category)
      .catch(() => {
        throw new UnprocessableEntityException('Given category not exists');
      });

    const subcategoryEntity = await this.subcategoryRepository
      .findOneOrFail(subcategory, { where: { category: categoryEntity } })
      .catch(() => {
        throw new UnprocessableEntityException(
          'Given subcategory not exists or not belongs to given category',
        );
      });

    const movement = await this.movementRepository
      .save({
        ...rest,
        category: categoryEntity,
        subcategory: subcategoryEntity,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.detail);
      });

    this.eventEmitter.emit(MovementEvents.CREATE, movement);

    return movement;
  }

  async findAll(params: MovementQueryDto): Promise<any> {
    const data = await this.movementRepository
      .find({
        select: [],
        relations: ['category', 'subcategory'],
        skip: params.perPage * (params.page - 1),
        take: params.perPage,
        order: {
          date: 'DESC',
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    if (!data.length) {
      throw new NotFoundException('No movements found');
    }

    const total = await this.movementRepository.count();
    const totalPages = Math.ceil(total / params.perPage);

    return {
      page: params.page,
      perPage: params.perPage,
      totalPages,
      lastPage: totalPages === params.page,
      total,
      data: classToPlain(data),
    };
  }

  async findAllAndGroupBy(
    params: MovementQueryDto,
  ): Promise<Pageable<GroupMovementDto>> {
    const skip = params.perPage * (params.page - 1);

    const dateFormat = DateformatMap[params.groupBy];

    const whereQuery = this.movementRepository
      .createQueryBuilder()
      .select(`distinct to_char(date, '${dateFormat.sql}')`, 'field')
      .orderBy('field', 'DESC')
      .limit(params.perPage)
      .offset(skip)
      .getQuery();

    const records = await this.movementRepository
      .find({
        where: `to_char(date, '${dateFormat.sql}') in (${whereQuery})`,
        order: {
          date: 'DESC',
          createdAt: 'DESC',
        },
        relations: ['category', 'subcategory'],
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    const groupedBy = records.reduce((map, curr) => {
      const key = dateFormat.format(curr.date);

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(curr);

      return map;
    }, new Map<string, Array<MovementDto>>());

    const data = [...groupedBy.entries()].map(([group, values]) => ({
      group,
      accumulated: values.reduce((acc, curr) => acc + curr.amount, 0),
      values,
    })) as GroupMovementDto[];

    const query = `select count(*) as total from (select distinct to_char(date, '${dateFormat.sql}') from movements) as t`;
    const [{ total }] = await this.movementRepository
      .query(query)
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    const totalPages = Math.ceil(+total / params.perPage);

    return {
      page: params.page,
      perPage: params.perPage,
      totalPages,
      total: +total,
      lastPage: totalPages === params.page,
      data,
    };
  }

  findOne(id: number): Promise<MovementEntity> {
    return this.movementRepository
      .findOneOrFail(id, {
        relations: ['category', 'subcategory'],
      })
      .catch(() => {
        throw new NotFoundException('Movement not found');
      });
  }

  async update(
    id: number,
    { category, subcategory, ...rest }: UpdateMovementDto,
  ): Promise<Record<string, string>> {
    const partialEntity: any = { ...rest };

    if (category) {
      partialEntity.category = { id: category };
    }

    if (subcategory) {
      partialEntity.subcategory = { id: subcategory };
    }

    const result = await this.movementRepository
      .update(id, partialEntity)
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    if (!result.affected) {
      throw new NotFoundException('Movement not found');
    }

    return {
      message: 'Movement updated successfully',
    };
  }

  async remove(id: number): Promise<Record<string, string>> {
    const result = await this.movementRepository.delete(id).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });

    if (!result.affected) {
      throw new NotFoundException('Movement not found');
    }

    return {
      message: 'Movement deleted successfully',
    };
  }

  // TODO: move to find method
  findByCategory(category: number): Promise<MovementEntity[]> {
    return this.movementRepository.find({ category: { id: category } });
  }

  findBySubcategory(subcategory: number): Promise<MovementEntity[]> {
    return this.movementRepository.find({ subcategory: { id: subcategory } });
  }

  async removeAll(): Promise<Record<string, string>> {
    await this.movementRepository.clear().catch((e) => {
      throw new InternalServerErrorException(e.message);
    });

    return {
      message: 'All movements deleted successfully',
    };
  }
}

const DateformatMap = {
  days: {
    sql: 'YYYY-MM-DD',
    format: (input: string) => DateTime.fromSQL(input).toFormat('yyyy-MM-dd'),
  },
  weeks: {
    sql: 'YYYY-MM-W',
    format: (input: string) => {
      const date = DateTime.fromSQL(input);
      const week = getWeekOfDate(date);
      return `${date.year}-${date.month}-${week}`;
    },
  },
  months: {
    sql: 'YYYY-MM',
    format: (input: string) => DateTime.fromSQL(input).toFormat('yyyy-MM'),
  },
  years: {
    sql: 'YYYY',
    format: (input: string) => DateTime.fromSQL(input).toFormat('yyyy'),
  },
};
