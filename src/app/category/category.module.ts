import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { Subcategory, SubcategorySchema } from './schemas/subcategory.schema';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { SubcategoryController } from './controllers/subcategory.controller';
import { SubcategoryService } from './services/subcategory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Subcategory.name, schema: SubcategorySchema },
    ]),
  ],
  controllers: [CategoryController, SubcategoryController],
  providers: [ValidationPipe, CategoryService, SubcategoryService],
})
export class CategoryModule {}
