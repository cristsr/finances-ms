import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';
import { MovementType } from 'app/movement/types';

export class CreateScheduled {
  @IsIn(['income', 'outcome'])
  type: MovementType;

  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  recurrent: string;

  @IsNumber()
  category: number;

  @IsNumber()
  subcategory: number;
}
