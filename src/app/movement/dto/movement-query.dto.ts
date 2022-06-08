import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Period, periods } from 'app/movement/types';
import { Transform } from 'class-transformer';

export class MovementQueryDto {
  @IsIn(periods)
  @IsString()
  period: Period;

  @IsString()
  date: string;

  @ValidateIf((o) => !!o.category)
  @Transform(({ value }) => value && +value)
  @IsNumber()
  category?: number | null;

  @IsOptional()
  @Transform(({ value }) => [...new Set(value.split(','))])
  @IsIn(['income', 'expense'], { each: true })
  @ArrayMaxSize(2)
  @IsArray()
  type: ('income' | 'expense')[];
}
