import { PageableQuery } from 'core/utils';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class MovementQueryDto implements PageableQuery {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  perPage: number;

  @IsString()
  @IsOptional()
  orderBy: string;
}
