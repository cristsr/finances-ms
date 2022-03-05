import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';
import { MovementType, movementTypes } from 'app/movement/types';

export class CreateMovementDto {
  @ApiProperty()
  @IsDateString()
  date: string;

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

export class UpdateMovementDto extends PartialType(CreateMovementDto) {}
