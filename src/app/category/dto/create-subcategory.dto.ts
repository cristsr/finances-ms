import { IsMongoId, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  name: string;
}

export class CreateManySubcategoriesDto extends CreateSubcategoryDto {
  @IsMongoId()
  category: string;
}
