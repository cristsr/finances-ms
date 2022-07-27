import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Raw, Repository } from 'typeorm';
import { DateTime, Interval } from 'luxon';
import { MovementEntity } from 'app/movement/entities';
import {
  CreateMovementDto,
  MovementDto,
  MovementQueryDto,
  UpdateMovementDto,
} from 'app/movement/dto';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';

@Injectable()
export class MovementService {
  readonly #logger = new Logger(MovementService.name);

  constructor(
    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(SubcategoryEntity)
    private subcategoryRepository: Repository<SubcategoryEntity>,
  ) {}

  /**
   * It creates a movement
   * @param {CreateMovementDto} data - CreateMovementDto
   * @returns MovementEntity
   */
  async create(data: CreateMovementDto): Promise<MovementEntity> {
    const category = await this.categoryRepository.findOne(data.category);

    if (!category) {
      const msg = `Category ${data.category} not found`;
      this.#logger.log(msg);
      throw new NotFoundException(msg);
    }

    const subcategory = await this.subcategoryRepository.findOne(
      data.subcategory,
      {
        where: {
          category,
        },
      },
    );

    if (!subcategory) {
      const msg = `Subcategory ${data.subcategory} not found`;
      this.#logger.log(msg);
      throw new NotFoundException(msg);
    }

    const movement = await this.movementRepository.save({
      ...data,
      category,
      subcategory,
    });

    this.#logger.log(`Movement ${movement.id} created`);

    return movement;
  }

  /**
   * It finds all movements that match the given query parameters
   * @param {MovementQueryDto} params - MovementQueryDto
   * @returns An array of MovementDto objects
   */
  async findAll(params: MovementQueryDto): Promise<MovementDto[]> {
    // Where conditions
    const where: any = {};

    // Setup where conditions
    if (params.period === 'day') {
      where.date = DateTime.fromISO(params.date).toSQLDate();
    }

    if (params.period === 'week') {
      const interval = Interval.fromISO(params.date);
      where.date = Between(
        interval.start.toSQLDate(),
        interval.end.toSQLDate(),
      );
    }

    if (params.period === 'month') {
      const date = DateTime.fromISO(params.date).toFormat('yyyy-MM');
      where.date = Raw((alias) => `to_char(${alias}, 'YYYY-MM') = :date`, {
        date,
      });
    }

    if (params.period === 'year') {
      const date = DateTime.fromISO(params.date).toFormat('yyyy');
      where.date = Raw((alias) => `to_char(${alias}, 'YYYY') = :date`, {
        date,
      });
    }

    if (params.category) {
      where.category = await this.categoryRepository
        .findOneOrFail(params.category)
        .catch(() => {
          const msg = `Category ${params.category} not found`;
          this.#logger.log(msg);
          throw new NotFoundException(msg);
        });
    }

    if (!!params.type?.length) {
      where.type = In(params.type);
    }

    // Execute query
    return await this.movementRepository.find({
      relations: ['category', 'subcategory'],
      where,
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * It finds a movement by id, and if it doesn't find it, it throws a NotFoundException
   * @param {number} id - number - the id of the movement we want to find
   * @returns A promise of a MovementEntity
   */
  findOne(id: number): Promise<MovementEntity> {
    return this.movementRepository
      .findOneOrFail(id, {
        relations: ['category', 'subcategory'],
      })
      .catch(() => {
        const msg = `Movement ${id} not found`;
        this.#logger.log(msg);
        throw new NotFoundException(msg);
      });
  }

  /**
   * It updates a movement entity with the given data, and returns the updated entity
   * @param {number} id - number - the id of the movement to update
   * @param {UpdateMovementDto} data - UpdateMovementDto
   * @returns The updated movement entity
   */
  async update(id: number, data: UpdateMovementDto): Promise<MovementEntity> {
    const partialEntity: any = { id, ...data };

    if (data.category) {
      partialEntity.category = await this.categoryRepository
        .findOneOrFail(data.category)
        .catch(() => {
          const msg = `Category ${data.category} not found`;
          this.#logger.log(msg);
          throw new NotFoundException(msg);
        });
    }

    if (data.subcategory) {
      partialEntity.subcategory = await this.subcategoryRepository
        .findOneOrFail(data.subcategory)
        .catch(() => {
          const msg = `Subcategory ${data.subcategory} not found`;
          this.#logger.log(msg);
          throw new NotFoundException(msg);
        });
    }

    const movementEntity = await this.movementRepository
      .save(partialEntity)
      .catch((e) => {
        this.#logger.log(`Error updating movement: ${e.message}`);
        throw new InternalServerErrorException(e.message);
      });

    this.#logger.log(`Movement ${movementEntity.id} updated`);

    return movementEntity;
  }

  /**
   * It deletes a movement from the database
   * @param {number} id - number - The id of the movement to delete
   * @returns A promise that resolves to an object with a message property.
   */
  async remove(id: number): Promise<Record<string, string>> {
    const result = await this.movementRepository.delete(id).catch((e) => {
      this.#logger.log(`Error deleting movement: ${e.message}`);
      throw new InternalServerErrorException(e.message);
    });

    if (!result.affected) {
      const msg = `Movement ${id} not found`;
      this.#logger.log(msg);
      throw new NotFoundException(msg);
    }

    this.#logger.log(`Movement ${id} deleted`);

    return {
      message: 'Movement deleted successfully',
    };
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
