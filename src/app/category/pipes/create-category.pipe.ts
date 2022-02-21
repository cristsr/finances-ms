import { ParseArrayPipe, PipeTransform, ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto } from 'app/category/dto';
import { isArray } from 'class-validator';

export class CreateCategoryPipe implements PipeTransform {
  transform(value: any): any {
    if (isArray(value)) {
      return new ParseArrayPipe({ items: CreateCategoryDto }).transform(value, {
        type: 'body',
      });
    }

    return new ValidationPipe({ transform: true }).transform(value, {
      type: 'body',
      metatype: CreateCategoryDto,
    });
  }
}
