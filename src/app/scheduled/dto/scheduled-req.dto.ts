import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateScheduled {
  @IsString()
  name: string;

  @IsNumber()
  category: number;

  @IsDateString()
  date: string;

  @IsBoolean()
  repeat: boolean;
}
