import { Module, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'app/category/entities/category.entity';
import { SubcategoryEntity } from 'app/category/entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, SubcategoryEntity])],
  controllers: [CategoryController],
  providers: [ValidationPipe, CategoryService],
})
export class CategoryModule {}
