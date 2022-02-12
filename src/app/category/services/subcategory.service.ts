import { Injectable } from '@nestjs/common';
import {
  CreateManySubcategoriesDto,
  CreateSubcategoryDto,
} from 'app/category/dto/create-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Subcategory,
  SubcategoryDocument,
} from 'app/category/schemas/subcategory.schema';
import { UpdateSubcategoryDto } from 'app/category/dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(Subcategory.name)
    private readonly subcategoryModel: Model<SubcategoryDocument>,
  ) {}

  createByCategory(category: string, createCategoryDto: CreateSubcategoryDto) {
    return this.subcategoryModel.create({
      ...createCategoryDto,
      category,
    });
  }

  createMany(createCategoryDto: CreateManySubcategoriesDto[]) {
    return this.subcategoryModel.insertMany(createCategoryDto);
  }

  findAll() {
    return this.subcategoryModel.find().exec();
  }

  findOne(id: string) {
    return this.subcategoryModel.findById(id).exec();
  }

  findByCategory(category: string) {
    return this.subcategoryModel.find({ category });
  }

  update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoryModel.findByIdAndUpdate(id, updateSubcategoryDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.subcategoryModel.findByIdAndRemove(id);
  }
}
