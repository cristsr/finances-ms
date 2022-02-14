import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export type CreateSubcategory = CreateSubcategoryDto | CreateSubcategoryDto[];
