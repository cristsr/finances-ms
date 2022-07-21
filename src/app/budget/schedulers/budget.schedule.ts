import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BudgetService } from 'app/budget/services';

@Injectable()
export class BudgetSchedule {
  constructor(private budgetService: BudgetService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON, {
    timeZone: 'America/Bogota',
  })
  async createBudgets() {
    await this.budgetService.generateBudgets();
  }
}
