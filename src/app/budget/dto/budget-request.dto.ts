import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBudgetDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  month: string;

  @ApiProperty()
  @IsNumber()
  category: number;
}

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}
