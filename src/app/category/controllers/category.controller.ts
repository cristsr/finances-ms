import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MongoIdPipe } from 'app/shared/pipes/mongo-id.pipe';
import { CategoryService } from '../services/category.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryPipe } from '../pipes/create-category.pipe';
import { CreateCategoryDto } from 'app/category/dto/create-category.dto';
import { CreateSubcategoryDto } from 'app/category/dto/create-subcategory.dto';
import { SubcategoryService } from 'app/category/services/subcategory.service';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubcategoryService,
  ) {}

  @Post()
  create(
    @Body(CreateCategoryPipe)
    createCategoryDto: CreateCategoryDto | CreateCategoryDto[],
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.remove(id);
  }

  @Post('/:id/subcategories')
  createSubcategory(
    @Param('id', MongoIdPipe) category: string,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return this.subcategoryService.createByCategory(
      category,
      createSubcategoryDto,
    );
  }

  @Get(':id/subcategories')
  findSubcategories(@Param('id', MongoIdPipe) id: string) {
    return this.subcategoryService.findByCategory(id);
  }
}
