import { Module } from '@nestjs/common';
import { MovementService } from './services/movement.service';
import { MovementController } from './controllers/movement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movement, MovementSchema } from 'app/movement/schemas/movement.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from 'app/movement/entities/movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovementEntity]),
    MongooseModule.forFeature([
      { name: Movement.name, schema: MovementSchema },
    ]),
  ],
  controllers: [MovementController],
  providers: [MovementService],
})
export class MovementModule {}
