import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'app/category/services';
import { CreateSubcategoryPipe } from 'app/category/pipes';
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  UpdateCategoryDto,
} from 'app/category/dto';

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
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Create categories' })
  @Post('bulk')
  createMany(
    @Body(
      new ParseArrayPipe({
        items: CreateCategoryDto,
      }),
    )
    createCategoryDto: CreateCategoryDto[],
  ) {
    return this.categoryService.createMany(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category by id' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): any {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category by id' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @ApiOperation({ summary: 'Delete all categories' })
  @Delete()
  removeAll(): any {
    return this.categoryService.removeAll();
  }

  @ApiOperation({ summary: 'Create subcategories' })
  @Post('/:id/subcategories')
  createSubcategory(
    @Param('id', ParseIntPipe) category: number,
    @Body(CreateSubcategoryPipe)
    createSubcategoryDto: CreateSubcategoryDto[],
  ) {
    return this.categoryService.createSubcategories(
      category,
      createSubcategoryDto,
    );
  }

  @ApiOperation({ summary: 'Get all subcategories' })
  @Get(':id/subcategories')
  findSubcategories(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findSubcategories(id);
  }

  @ApiOperation({ summary: 'Get subcategory by id' })
  @Get(':id/subcategories/:idsub')
  findSubcategory(
    @Param('id', ParseIntPipe) category: number,
    @Param('idsub', ParseIntPipe) subcategory: number,
  ) {
    return this.categoryService.findSubcategory(category, subcategory);
  }

  @ApiOperation({ summary: 'Update subcategory by id' })
  @Put(':id/subcategories/:idsub')
  updateSubcategory(
    @Param('id', ParseIntPipe) category: number,
    @Param('idsub', ParseIntPipe) subcategory: number,
    @Body() updateSubcategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateSubcategory(
      category,
      subcategory,
      updateSubcategoryDto,
    );
  }

  @ApiOperation({ summary: 'Delete subcategory by id' })
  @Delete(':id/subcategories/:idSub')
  removeSubcategory(
    @Param('id', ParseIntPipe) category: number,
    @Param('idSub', ParseIntPipe) subcategory: number,
  ) {
    return this.categoryService.removeSubcategory(category, subcategory);
  }
}
