import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MongoIdPipe } from 'app/shared/pipes/mongo-id.pipe';
import { SubcategoryService } from 'app/category/services/subcategory.service';
import { UpdateSubcategoryDto } from 'app/category/dto/update-subcategory.dto';
import { CreateManySubcategoriesDto } from 'app/category/dto/create-subcategory.dto';

@Controller({
  path: 'subcategories',
  version: '1',
})
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  create(
    @Body(
      new ParseArrayPipe({
        items: CreateManySubcategoriesDto,
      }),
    )
    createCategoryDto: CreateManySubcategoriesDto[],
  ) {
    return this.subcategoryService.createMany(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.subcategoryService.remove(id);
  }
}
