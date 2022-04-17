import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from 'app/category/services';
import { CategoryController } from 'app/category/controllers';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';

const entities = TypeOrmModule.forFeature([CategoryEntity, SubcategoryEntity]);

@Module({
  imports: [entities],
  controllers: [CategoryController],
  providers: [ValidationPipe, CategoryService],
  exports: [entities],
})
export class CategoryModule {}
