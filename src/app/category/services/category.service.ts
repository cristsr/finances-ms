import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Model } from 'mongoose';
import {
  Subcategory,
  SubcategoryDocument,
} from '../schemas/subcategory.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,

    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<SubcategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto | CreateCategoryDto[]) {
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.updateOne({ id }, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryModel.deleteOne({ id });
  }

  subcategories(id: string) {
    return this.subcategoryModel.find({ category: id }).exec();
  }
}
