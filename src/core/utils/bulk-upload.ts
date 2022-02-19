import { Type as ClassType } from '@nestjs/common';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

type Constructor<T> = new (...args: any[]) => T;

export function BulkUpload<T extends Constructor<any>>(
  type: ClassType<T>,
): Constructor<any> {
  class BulkUpload {
    @IsArray()
    @Type(() => type)
    @ValidateNested({ each: true })
    bulk: T[];
  }

  return BulkUpload;
}
