import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { mapEnvironmentKeys } from 'src/environment/utils';

export class Environment {
  @IsString()
  ENV: string = undefined;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  PORT: number = undefined;

  @IsString()
  DB_TYPE: string = undefined;

  @IsString()
  DB_HOST: string = undefined;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  DB_PORT: number = undefined;

  @IsString()
  DB_NAME: string = undefined;

  @IsString()
  DB_USER: string = undefined;

  @IsString()
  DB_PASSWORD: string = undefined;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  DB_SSL: boolean = undefined;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  DB_SYNCHRONIZE: boolean = undefined;

  @IsString()
  DB_URI: string = undefined;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  SHOW_DOCS: boolean = undefined;
}

export const ENV = mapEnvironmentKeys<Environment>(Environment);
