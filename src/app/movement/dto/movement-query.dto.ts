import { PageableQuery } from 'core/utils';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class MovementQueryDto implements PageableQuery {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  perPage: number;

  @IsOptional()
  @IsIn(['days', 'weeks', 'months', 'years'])
  @IsString()
  groupBy: 'days' | 'weeks' | 'months' | 'years' = 'days';

  @IsString()
  @IsOptional()
  orderBy: string;
}
