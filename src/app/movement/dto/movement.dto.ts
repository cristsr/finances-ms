import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';

export class Movement {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDateString()
  date: string | Date;

  @ApiProperty()
  @IsIn(['ingreso', 'egreso'])
  type: 'ingreso' | 'egreso';

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
