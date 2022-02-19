import { Movement } from 'app/movement/dto/movement';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class MovementDto implements Movement {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  date: string;

  @ApiProperty()
  @AutoMap()
  description: string;

  @ApiProperty()
  @AutoMap()
  amount: number;

  @ApiProperty()
  @AutoMap()
  category;

  subcategory;
}
