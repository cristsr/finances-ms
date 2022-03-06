import { Test, TestingModule } from '@nestjs/testing';
import { BudgetSchedule } from './budget.schedule';

describe('Budget', () => {
  let provider: BudgetSchedule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetSchedule],
    }).compile();

    provider = module.get<BudgetSchedule>(BudgetSchedule);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
