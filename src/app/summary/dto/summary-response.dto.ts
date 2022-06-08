import { IsNumber } from 'class-validator';
import { CategoryDto } from 'app/category/dto';

export class SummaryDto {
  @IsNumber()
  totalBalance: number;

  @IsNumber()
  income: number;

  @IsNumber()
  expense: number;
}

export class ExpenseDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  percentage: number;

  category: CategoryDto;
}

export class ExpensesDto {
  day: ExpenseDto[];

  week: ExpenseDto[];

  month: ExpenseDto[];
}
