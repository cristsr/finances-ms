import { Module } from '@nestjs/common';
import { MovementService } from './services/movement.service';
import { MovementController } from './controllers/movement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movement, MovementSchema } from 'app/movement/schemas/movement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movement.name, schema: MovementSchema },
    ]),
  ],
  controllers: [MovementController],
  providers: [MovementService],
})
export class MovementModule {}
