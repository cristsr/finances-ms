import { Module } from '@nestjs/common';
import { MovementService } from './services/movement.service';
import { MovementController } from './controllers/movement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from 'app/movement/entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovementEntity])],
  controllers: [MovementController],
  providers: [MovementService],
})
export class MovementModule {}
