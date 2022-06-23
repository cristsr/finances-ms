import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';
import { MovementType, movementTypes } from 'app/movement/types';

export class CreateScheduled {
  @IsIn(movementTypes)
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
