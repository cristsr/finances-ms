import { Module } from '@nestjs/common';
import { MovementService } from './services/movement.service';
import { MovementController } from './controllers/movement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from 'app/movement/entities';
import { CategoryModule } from 'app/category/category.module';

const entities = TypeOrmModule.forFeature([MovementEntity]);

@Module({
  imports: [entities, CategoryModule],
  controllers: [MovementController],
  providers: [MovementService],
  exports: [entities],
})
export class MovementModule {}
