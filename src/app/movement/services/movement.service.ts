import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Pageable } from 'core/utils';
import { Repository } from 'typeorm';
import { MovementEntity } from 'app/movement/entities';
import {
  CreateMovementDto,
  UpdateMovementDto,
  MovementQueryDto,
  GroupMovementDto,
} from 'app/movement/dto';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';
import { DateTime } from 'luxon';
import { classToPlain } from 'class-transformer';

const formatMap = {
  days: (date: string) => DateTime.fromSQL(date).toFormat('yyyy-MM-dd'),
  weeks: (date: string) => DateTime.fromSQL(date).toFormat('yyyy-WW'),
  months: (date: string) => DateTime.fromSQL(date).toFormat('yyyy-MM'),
  years: (date: string) => DateTime.fromSQL(date).toFormat('yyyy'),
};

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

    return this.movementRepository
      .save({
        ...rest,
        category: categoryEntity,
        subcategory: subcategoryEntity,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.detail);
      });
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

    const whereQuery = this.movementRepository
      .createQueryBuilder()
      .select(`distinct extract(${params.groupBy} from date)`, 'field')
      .orderBy('field', 'DESC')
      .limit(params.perPage)
      .offset(skip)
      .getQuery();

    const records = await this.movementRepository
      .find({
        where: `extract(${params.groupBy} from date) in (${whereQuery})`,
        order: {
          date: 'DESC',
        },
        relations: ['category', 'subcategory'],
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    const groupedBy = records.reduce((acc, curr) => {
      const key = formatMap[params.groupBy](curr.date as any);

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(curr);

      return acc;
    }, {});

    const data = Object.entries(groupedBy).map(([group, values]) => ({
      group,
      values,
    })) as GroupMovementDto[];

    const query = `select count(*) as total from (select distinct extract(${params.groupBy} from date) from movements) as t`;

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
      lastPage: totalPages === params.page,
      total: +total,
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
