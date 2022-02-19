import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateMovementDto,
  MovementQueryDto,
  UpdateMovementDto,
} from 'app/movement/dto';
import { Movement, MovementDocument } from '../schemas/movement.schema';
import { Model } from 'mongoose';
import { Pageable } from 'core/utils';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class MovementService {
  constructor(
    @InjectModel(Movement.name)
    private movementModel: Model<MovementDocument>,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async create(createMovementDto: CreateMovementDto) {
    return this.movementModel.create(createMovementDto);
  }

  async findAll(params: MovementQueryDto): Promise<Pageable<Movement>> {
    const data = await this.movementModel
      .find()
      .skip(params.perPage * params.page)
      .limit(params.perPage)
      .sort(params.orderBy || '-date')
      .populate('category subcategory')
      .exec()
      .catch((e) => {
        // Handle internal errors
        throw new InternalServerErrorException(e.message);
      });

    const total = await this.movementModel.estimatedDocumentCount().exec();
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

  findOne(id: string): Promise<Movement> {
    return this.movementModel.findById(id).exec();
  }

  update(id: string, updateMovementDto: UpdateMovementDto) {
    return this.movementModel
      .findByIdAndUpdate(id, updateMovementDto, {
        new: true,
      })
      .exec();
  }

  remove(id: string) {
    return this.movementModel.findByIdAndRemove(id);
  }

  findByCategory(category: string) {
    return this.movementModel.find({ category });
  }

  findBySubcategory(subcategory: string) {
    return this.movementModel.find({ subcategory });
  }
}
