import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovementDto {
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

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
