import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementService } from 'app/movement/services';
import { MovementController } from 'app/movement/controllers';
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
