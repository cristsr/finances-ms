import { ParseArrayPipe, PipeTransform, ValidationPipe } from '@nestjs/common';
import { isArray } from 'class-validator';
import { CreateSubcategoryDto } from 'app/category/dto';

export class CreateSubcategoryPipe implements PipeTransform {
  transform(value: any): any {
    if (isArray(value)) {
      return new ParseArrayPipe({ items: CreateSubcategoryDto }).transform(
        value,
        {
          type: 'body',
        },
      );
    }

    return new ValidationPipe({ transform: true }).transform(value, {
      type: 'body',
      metatype: CreateSubcategoryDto,
    });
  }
}
