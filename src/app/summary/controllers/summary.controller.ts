import { Controller, Get } from '@nestjs/common';
import { SummaryService } from 'app/summary/services';

@Controller({
  path: 'summary',
  version: '1',
})
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  summary() {
    return this.summaryService.summary();
  }
}
