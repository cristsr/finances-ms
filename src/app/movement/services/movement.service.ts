import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { UpdateMovementDto } from '../dto/update-movement.dto';
import { Movement, MovementDocument } from '../schemas/movement.schema';
import { Model } from 'mongoose';

@Injectable()
export class MovementService {
  constructor(
    @InjectModel(Movement.name)
    private readonly movementModel: Model<MovementDocument>,
  ) {}

  create(createMovementDto: CreateMovementDto) {
    return this.movementModel.create(createMovementDto);
  }

  findAll() {
    return this.movementModel.find();
  }

  findOne(id: string) {
    return this.movementModel.findById(id);
  }

  update(id: string, updateMovementDto: UpdateMovementDto) {
    return this.movementModel.findByIdAndUpdate(id, updateMovementDto, {
      new: true,
    });
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
