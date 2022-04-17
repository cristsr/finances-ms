import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapper } from '@automapper/core';
import { Between, In, Raw, Repository } from 'typeorm';
import { DateTime, Interval } from 'luxon';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MovementEntity } from 'app/movement/entities';
import {
  CreateMovementDto,
  GroupMovementDto,
  MovementDto,
  MovementQueryDto,
  UpdateMovementDto,
} from 'app/movement/dto';
import { MovementEvents } from 'app/movement/types';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';

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

  async findAll(params: MovementQueryDto): Promise<GroupMovementDto[]> {
    const whereConditions: any = {};

    // Setup where conditions
    if (params.period === 'day') {
      whereConditions.date = DateTime.fromISO(params.date).toSQLDate();
    }

    if (params.period === 'week') {
      const interval = Interval.fromISO(params.date);
      whereConditions.date = Between(
        interval.start.toSQLDate(),
        interval.end.toSQLDate(),
      );
    }

    if (params.period === 'month') {
      const date = DateTime.fromISO(params.date).toFormat('yyyy-MM');
      whereConditions.date = Raw(
        (alias) => `to_char(${alias}, 'YYYY-MM') = :date`,
        { date },
      );
    }

    if (params.period === 'year') {
      const date = DateTime.fromISO(params.date).toFormat('yyyy');
      whereConditions.date = Raw(
        (alias) => `to_char(${alias}, 'YYYY') = :date`,
        { date },
      );
    }

    if (params.category) {
      whereConditions.category = await this.categoryRepository
        .findOneOrFail(params.category)
        .catch(() => {
          throw new NotFoundException('Given category not exists');
        });
    }

    if (!!params.type?.length) {
      whereConditions.type = In(params.type);
    }

    // Execute query
    const records = await this.movementRepository
      .find({
        relations: ['category', 'subcategory'],
        where: whereConditions,
        order: { date: 'DESC' },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    return MovementService.groupMovements(records);
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
  ): Promise<MovementEntity> {
    const partialEntity: any = { id, ...rest };

    if (category) {
      partialEntity.category = await this.categoryRepository
        .findOneOrFail(category)
        .catch(() => {
          throw new NotFoundException('Category not found');
        });
    }

    if (subcategory) {
      partialEntity.subcategory = await this.subcategoryRepository
        .findOneOrFail(subcategory)
        .catch(() => {
          throw new NotFoundException('Subcategory not found');
        });
    }

    const movementEntity = await this.movementRepository
      .save(partialEntity)
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    this.eventEmitter.emit(MovementEvents.UPDATE, movementEntity);

    return movementEntity;
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

  static groupMovements(movements: MovementEntity[]): GroupMovementDto[] {
    const groupedByDay = movements.reduce((map, curr) => {
      if (!map.has(curr.date)) {
        map.set(curr.date, []);
      }

      map.get(curr.date).push(curr);

      return map;
    }, new Map<string, Array<MovementDto>>());

    return [...groupedByDay.entries()].map(([date, values]) => ({
      date,
      accumulated: values.reduce((acc: number, { amount }) => acc + amount, 0),
      values,
    }));
  }
}
