import { Module, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'app/category/entities/category.entity';
import { SubcategoryEntity } from 'app/category/entities/subcategory.entity';

const entities = TypeOrmModule.forFeature([CategoryEntity, SubcategoryEntity]);

@Module({
  imports: [entities],
  controllers: [CategoryController],
  providers: [ValidationPipe, CategoryService],
  exports: [entities],
})
export class CategoryModule {}
