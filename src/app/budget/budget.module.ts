import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BudgetController } from 'app/budget/controllers';
import { BudgetService } from 'app/budget/services';
import { BudgetEntity, BudgetMovementEntity } from 'app/budget/entities';
import { BudgetSchedule } from './schedulers/budget.schedule';
import { CategoryModule } from 'app/category/category.module';
import { MovementModule } from 'app/movement/movement.module';

const entities = TypeOrmModule.forFeature([BudgetEntity, BudgetMovementEntity]);

@Module({
  controllers: [BudgetController],
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    CategoryModule,
    MovementModule,
    entities,
  ],
  providers: [BudgetService, BudgetSchedule],
  exports: [entities],
})
export class BudgetModule {}
