import { IsIn, IsString } from 'class-validator';
import { GroupBy, groupByTypes } from 'app/movement/types';

export class MovementQueryDto {
  @IsIn(groupByTypes)
  @IsString()
  groupBy: GroupBy;

  @IsString()
  date: string;
}
