import { IsNumber } from 'class-validator';

export class SummaryDto {
  @IsNumber()
  totalBalance: number;

  @IsNumber()
  income: number;

  @IsNumber()
  expense: number;
}
