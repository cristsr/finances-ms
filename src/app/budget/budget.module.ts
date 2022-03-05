import { Module } from '@nestjs/common';
import { BudgetController } from 'app/budget/controllers';
import { BudgetService } from 'app/budget/services';
import { BudgetEntity, BudgetMovementEntity } from 'app/budget/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = TypeOrmModule.forFeature([BudgetEntity, BudgetMovementEntity]);

@Module({
  controllers: [BudgetController],
  imports: [entities],
  providers: [BudgetService],
  exports: [entities],
})
export class BudgetModule {}
