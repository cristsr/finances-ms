import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';
import { MovementType, movementTypes } from 'app/movement/types';

export class Movement {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDateString()
  date: string | Date;

  @ApiProperty()
  @IsIn(movementTypes)
  type: MovementType;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  category: number;

  @ApiProperty()
  @IsNumber()
  subcategory: number;
}
