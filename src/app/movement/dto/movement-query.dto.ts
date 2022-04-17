import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Period, periods } from 'app/movement/types';
import { Transform } from 'class-transformer';

export class MovementQueryDto {
  @IsIn(periods)
  @IsString()
  period: Period;

  @IsString()
  date: string;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsNumber()
  category: number;

  @IsOptional()
  @Transform(({ value }) => [...new Set(value.split(','))])
  @IsIn(['income', 'expense'], { each: true })
  @ArrayMaxSize(2)
  @IsArray()
  type: ('income' | 'expense')[];
}
