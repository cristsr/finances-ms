import { IsNumber, IsString } from 'class-validator';

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

  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsString()
  icon: string;

  @IsNumber()
  percentage: number;
}
