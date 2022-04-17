import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { mapEnvironmentKeys } from 'src/environment/utils';

export class Environment {
  @IsString()
  ENV: string = null;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  PORT: number = null;

  @IsString()
  DB_TYPE: string = null;

  @IsString()
  DB_HOST: string = null;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  DB_PORT: number = null;

  @IsString()
  DB_NAME: string = null;

  @IsString()
  DB_USER: string = null;

  @IsString()
  DB_PASSWORD: string = null;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  DB_SSL: boolean = null;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  DB_SYNCHRONIZE: boolean = null;

  @IsString()
  DB_URI: string = null;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  SHOW_DOCS: boolean = null;
}

export const ENV = mapEnvironmentKeys<Environment>(Environment);
