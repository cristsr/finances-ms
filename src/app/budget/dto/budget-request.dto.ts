import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBudget {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  category: number;

  @ApiProperty()
  @IsBoolean()
  repeat: boolean;
}

export class UpdateBudget extends PartialType(CreateBudget) {}
