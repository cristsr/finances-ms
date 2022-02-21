import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category as CategoryMongo,
  CategorySchema,
} from './schemas/category.schema';
import {
  Subcategory as SubcategoryMongo,
  SubcategorySchema,
} from './schemas/subcategory.schema';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'app/category/entities/category.entity';
import { SubcategoryEntity } from 'app/category/entities/subcategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, SubcategoryEntity]),
    MongooseModule.forFeature([
      { name: CategoryMongo.name, schema: CategorySchema },
      { name: SubcategoryMongo.name, schema: SubcategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [ValidationPipe, CategoryService],
})
export class CategoryModule {}
