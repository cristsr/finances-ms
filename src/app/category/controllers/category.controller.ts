import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MongoIdPipe } from 'app/shared/pipes/mongo-id.pipe';
import { CategoryService } from '../services/category.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryPipe } from '../pipes/create-category.pipe';
import { CreateCategory } from '../dto/create-category.dto';
import { CreateSubcategory } from '../dto/create-subcategory.dto';
import { CreateSubcategoryPipe } from '../pipes/create-subcategory.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create categories' })
  @Post()
  create(
    @Body(CreateCategoryPipe)
    createCategoryDto: CreateCategory,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category by id' })
  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category by id' })
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.remove(id);
  }

  @ApiOperation({ summary: 'Create subcategories' })
  @Post('/:id/subcategories')
  createSubcategory(
    @Param('id', MongoIdPipe) category: string,
    @Body(CreateSubcategoryPipe)
    createSubcategoryDto: CreateSubcategory,
  ) {
    return this.categoryService.createSubcategories(
      category,
      createSubcategoryDto,
    );
  }

  @ApiOperation({ summary: 'Get all subcategories' })
  @Get(':id/subcategories')
  findSubcategories(@Param('id', MongoIdPipe) id: string) {
    return this.categoryService.findSubcategories(id);
  }

  @ApiOperation({ summary: 'Get subcategory by id' })
  @Get(':id/subcategories/:idsub')
  findSubcategory(
    @Param('id', MongoIdPipe) category: string,
    @Param('idsub', MongoIdPipe) subcategory: string,
  ) {
    return this.categoryService.findSubcategory(category, subcategory);
  }

  @ApiOperation({ summary: 'Update subcategory by id' })
  @Put(':id/subcategories/:idsub')
  updateSubcategory(
    @Param('id', MongoIdPipe) category: string,
    @Param('idsub', MongoIdPipe) subcategory: string,
    @Body() updateSubcategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateSubcategory(
      category,
      subcategory,
      updateSubcategoryDto,
    );
  }

  @ApiOperation({ summary: 'Delete subcategory by id' })
  @Delete(':id/subcategories/:idsub')
  removeSubcategory(
    @Param('id', MongoIdPipe) category: string,
    @Param('idsub', MongoIdPipe) subcategory: string,
  ) {
    return this.categoryService.removeSubcategory(category, subcategory);
  }
}
