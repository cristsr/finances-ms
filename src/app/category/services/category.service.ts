import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCategory } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Model } from 'mongoose';
import { CreateSubcategory } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from 'app/category/dto/update-subcategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategory) {
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel
      .find()
      .populate('subcategories')
      .sort('name')
      .exec();
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

  createSubcategories(category: string, subcategories: CreateSubcategory) {
    return this.categoryModel.findByIdAndUpdate(
      category,
      {
        $push: {
          subcategories: subcategories,
        },
      },
      {
        new: true,
      },
    );
  }

  findSubcategories(category: string) {
    return this.categoryModel
      .findById(category)
      .select('subcategories')
      .transform((result) => result.subcategories)
      .exec()
      .catch((err) => {
        throw new UnprocessableEntityException(err.message);
      });
  }

  findSubcategory(category: string, subcategory: string) {
    return this.categoryModel
      .findById(category)
      .select({
        subcategories: {
          $elemMatch: {
            _id: subcategory,
          },
        },
      })
      .transform(({ subcategories: [subcategory] }) => subcategory)
      .exec();
  }

  updateSubcategory(
    category: string,
    subcategory: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.categoryModel
      .findByIdAndUpdate(
        category,
        {
          $set: {
            'subcategories.$[subcategory].name': updateSubcategoryDto.name,
          },
        },
        {
          arrayFilters: [
            {
              'subcategory._id': subcategory,
            },
          ],
          new: true,
        },
      )
      .select({
        subcategories: {
          $elemMatch: {
            _id: subcategory,
          },
        },
      })
      .exec()
      .then(({ subcategories: [subcategory] }) => subcategory);
  }

  removeSubcategory(category: string, subcategory: string) {
    return this.categoryModel
      .findByIdAndUpdate(
        category,
        {
          $pull: {
            subcategories: {
              _id: subcategory,
            },
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }
}
