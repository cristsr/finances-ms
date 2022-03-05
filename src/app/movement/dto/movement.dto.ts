import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto, SubCategoryDto } from 'app/category/dto';

export class MovementDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  category: CategoryDto;

  @ApiProperty()
  @IsNumber()
  subcategory: SubCategoryDto;
}

export class GroupMovementDto {
  @IsString()
  group: string;

  @IsNumber()
  accumulated: number;

  @ApiProperty()
  @IsArray()
  @Type(() => MovementDto)
  @ValidateNested({ each: true })
  values: MovementDto[];
}
