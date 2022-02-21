import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSubcategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}
