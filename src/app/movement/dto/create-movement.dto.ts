import { IsDate, IsMongoId, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsMongoId()
  category: string;

  @ApiProperty()
  @IsMongoId()
  subcategory: string;
}
