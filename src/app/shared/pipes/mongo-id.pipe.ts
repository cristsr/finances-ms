import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class MongoIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Validation failed (mongo id is expected)');
    }

    return value;
  }
}
