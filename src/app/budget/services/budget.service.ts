import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBudgetDto, CreateBudgetDto, BudgetDto } from 'app/budget/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetEntity } from 'app/budget/entities';
import { Between, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { CategoryEntity } from 'app/category/entities';
import { MovementEntity } from 'app/movement/entities';
// TODO short import
import { MovementService } from 'app/movement/services/movement.service';
import { GroupMovementDto } from 'app/movement/dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private budgetRepository: Repository<BudgetEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<BudgetEntity> {
    const utc = DateTime.utc();
    const startDate = utc.startOf('month').toFormat('yyyy-MM-dd');
    const endDate = utc.endOf('month').toFormat('yyyy-MM-dd');

    const categoryEntity = await this.categoryRepository
      .findOneOrFail(createBudgetDto.category)
      .catch(() => {
        throw new NotFoundException('Category not found');
      });

    return this.budgetRepository
      .save({
        ...createBudgetDto,
        startDate,
        endDate,
        category: categoryEntity,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll(): Promise<BudgetDto[]> {
    const budgets = await this.budgetRepository
      .find({
        relations: ['category'],
        where: {
          active: true,
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    const result = [];

    for (const budget of budgets) {
      const { spent } = await this.movementRepository
        .createQueryBuilder()
        .select('sum(amount)', 'spent')
        .where({
          category: budget.category.id,
          date: Between(budget.startDate, budget.endDate),
        })
        .getRawOne()
        .catch(() => ({ spent: 0 }));

      result.push({
        ...budget,
        spent: Number(spent),
      });
    }

    return result;
  }

  findOne(id: number): Promise<BudgetEntity> {
    return this.budgetRepository
      .findOneOrFail(id, { relations: ['category'] })
      .catch(() => {
        throw new NotFoundException('Budget not found');
      });
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    const updateObject: any = {};

    if (updateBudgetDto.amount) {
      updateObject.amount = updateBudgetDto.amount;
    }

    if (updateBudgetDto.category) {
      updateObject.category = {
        id: updateBudgetDto.category,
      };
    }

    return this.budgetRepository.update(id, updateObject);
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }

  async getBudgetMovements(budgetId: number): Promise<GroupMovementDto[]> {
    const budget = await this.budgetRepository
      .findOneOrFail(budgetId, { relations: ['category'] })
      .catch(() => {
        throw new NotFoundException('Budget not found');
      });

    const movements = await this.movementRepository
      .find({
        relations: ['category', 'subcategory'],
        where: {
          category: budget.category,
          date: Between(budget.startDate, budget.endDate),
        },
        order: {
          date: 'DESC',
          createdAt: 'DESC',
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    return MovementService.groupMovements(movements);
  }
}
