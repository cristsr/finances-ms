import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  UpdateCategoryDto,
  UpdateSubcategoryDto,
} from 'app/category/dto';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(SubcategoryEntity)
    private subcategoryRepository: Repository<SubcategoryEntity>,
  ) {}

  async create({ name, color, icon, subcategories }: CreateCategoryDto) {
    const category = await this.categoryRepository
      .save({ name, icon, color })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    if (!subcategories?.length) {
      return category;
    }

    category.subcategories = await this.subcategoryRepository
      .save(
        subcategories.map((v) => {
          return this.subcategoryRepository.create({ ...v, category });
        }),
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    return category;
  }

  async createMany(categoriesDto: CreateCategoryDto[]) {
    for (const category of categoriesDto) {
      await this.create(category);
    }

    return {
      message: 'Categories created successfully',
    };
  }

  findAll() {
    return this.categoryRepository
      .find({ relations: ['subcategories'] })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });
  }

  findOne(id: number) {
    return this.categoryRepository
      .findOneOrFail(id, { relations: ['subcategories'] })
      .catch(() => {
        throw new NotFoundException('Category not found');
      });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): any {
    return this.categoryRepository.update(id, updateCategoryDto).catch(() => {
      throw new NotFoundException('Category not found');
    });
  }

  remove(id: number): any {
    return this.categoryRepository.delete(id).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }

  async removeAll() {
    await this.categoryRepository.delete({});

    return {
      message: 'Categories removed successfully',
    };
  }

  async createSubcategory(category: number, subcategory: CreateSubcategoryDto) {
    return this.subcategoryRepository.save({
      ...subcategory,
      category: { id: category },
    });
  }

  async createSubcategories(
    category: number,
    subcategories: CreateSubcategoryDto[],
  ) {
    await this.subcategoryRepository.insert(
      subcategories.map((v) => ({
        ...v,
        category: { id: category },
      })),
    );
  }

  findSubcategories(category: number) {
    return this.subcategoryRepository.find({
      where: { category: { id: category } },
    });
  }

  findSubcategory(category: number, subcategory: number) {
    return this.subcategoryRepository.findOne({
      where: { category: { id: category }, id: subcategory },
    });
  }

  updateSubcategory(
    category: number,
    subcategory: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryRepository.update(
      { category: { id: category }, id: subcategory },
      updateSubcategoryDto,
    );
  }

  removeSubcategory(category: number, subcategory: number) {
    return this.subcategoryRepository.delete({
      category: { id: category },
      id: subcategory,
    });
  }
}
