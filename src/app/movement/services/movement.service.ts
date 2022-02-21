import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
} from 'app/movement/dto';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,

    @InjectMapper() private mapper: Mapper,
  ) {}

  create({ category, subcategory, ...rest }: CreateMovementDto) {
    return this.movementRepository
      .save({
        ...rest,
        category: {
          id: category,
        },
        subcategory: {
          id: subcategory,
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }

  async findAll(params: MovementQueryDto): Promise<Pageable<MovementEntity>> {
    const data = await this.movementRepository
      .find({
        relations: ['category', 'subcategory'],
        skip: params.perPage * params.page,
        take: params.perPage,
        order: {
          date: 'DESC',
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    const total = await this.movementRepository.count();
    const totalPages = Math.ceil(total / params.perPage);

    return {
      page: params.page,
      perPage: params.perPage,
      totalPages,
      lastPage: totalPages === params.page,
      total,
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

  update(id: number, { category, subcategory, ...rest }: UpdateMovementDto) {
    const partialEntity: any = { ...rest };

    if (category) {
      partialEntity.category = { id: category };
    }

    if (subcategory) {
      partialEntity.subcategory = { id: subcategory };
    }

    return this.movementRepository.update(id, partialEntity).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }

  remove(id: string) {
    return this.movementRepository.delete(id).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }

  findByCategory(category: number) {
    return this.movementRepository.find({ category: { id: category } });
  }

  findBySubcategory(subcategory: number) {
    return this.movementRepository.find({ subcategory: { id: subcategory } });
  }
}
