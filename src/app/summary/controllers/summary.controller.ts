import { Controller, Get } from '@nestjs/common';
import { SummaryService } from 'app/summary/services';
import { ApiTags } from '@nestjs/swagger';
import { ClientDate } from 'core/decorators';
import { DateTime } from 'luxon';

@ApiTags('Summary')
@Controller({
  path: 'summary',
  version: '1',
})
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('balance')
  balance() {
    return this.summaryService.balance();
  }

  @Get('expenses')
  expenses(@ClientDate() date: DateTime) {
    return this.summaryService.expenses(date);
  }

  @Get('last-movements')
  lastMovements() {
    return this.summaryService.lastMovements();
  }
}
