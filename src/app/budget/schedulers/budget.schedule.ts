import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { BudgetService } from 'app/budget/services';
import { MovementEvents } from 'app/movement/types';
import { MovementEntity } from 'app/movement/entities';

@Injectable()
export class BudgetSchedule {
  constructor(private budgetService: BudgetService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: 'America/Bogota',
  })
  createBudgets() {
    // this.budgetService.createBudgets();
  }

  @OnEvent(MovementEvents.CREATE)
  async onMovementCreated(movement: MovementEntity) {
    await this.budgetService.createBudgetMovement(movement);
    console.log('Budget movement created: ', movement.id);
  }

  @OnEvent(MovementEvents.UPDATE)
  async onMovementUpdated(movement: MovementEntity) {
    await this.budgetService.updateBudgetMovement(movement);
    console.log('Budget movement updated: ', movement.id);
  }
}
