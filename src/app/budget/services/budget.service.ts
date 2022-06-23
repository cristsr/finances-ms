import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { UpdateBudget, CreateBudget, BudgetDto } from 'app/budget/dto';
import { MovementDto } from 'app/movement/dto';
import { BudgetEntity } from 'app/budget/entities';
import { CategoryEntity } from 'app/category/entities';
import { MovementEntity } from 'app/movement/entities';

@Injectable()
export class BudgetService {
  #logger = new Logger(BudgetService.name);

  constructor(
    @InjectRepository(BudgetEntity)
    private budgetRepository: Repository<BudgetEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,
  ) {}

  async create(data: CreateBudget): Promise<BudgetDto> {
    this.#logger.log(`Creating budget ${data.name}`);

    const utc = DateTime.utc();
    const startDate = utc.startOf('month').toFormat('yyyy-MM-dd');
    const endDate = utc.endOf('month').toFormat('yyyy-MM-dd');

    const categoryEntity = await this.categoryRepository.findOne(data.category);

    if (!categoryEntity) {
      this.#logger.log(`Category ${data.category} not found`);
      throw new NotFoundException('Category not found');
    }

    const budget = await this.budgetRepository
      .save({
        ...data,
        startDate,
        endDate,
        category: categoryEntity,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });

    this.#logger.log(`Budget ${budget.name} created`);

    return {
      ...budget,
      spent: 0,
      percentage: 0,
    };
  }

  async findAll(): Promise<BudgetDto[]> {
    this.#logger.log('Fetching budgets');

    const budgets = await this.budgetRepository
      .find({
        relations: ['category'],
        where: { active: true },
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });

    const result: BudgetDto[] = [];

    for (const budget of budgets) {
      const spent = await this.movementRepository
        .createQueryBuilder()
        .select('sum(amount)', 'spent')
        .where({
          category: budget.category.id,
          date: Between(budget.startDate, budget.endDate),
        })
        .getRawOne()
        .then((result) => +result.spent)
        .catch(() => 0);

      result.push({
        ...budget,
        spent,
        percentage: Math.floor((spent / budget.amount) * 100),
      });
    }

    this.#logger.log('Budgets fetched');

    return result;
  }

  async findOne(id: number): Promise<BudgetDto> {
    const budget = await this.budgetRepository
      .findOneOrFail(id, { relations: ['category'] })
      .catch(() => {
        throw new NotFoundException('Budget not found');
      });

    const spent = await this.movementRepository
      .createQueryBuilder()
      .select('sum(amount)', 'spent')
      .where({
        category: budget.category.id,
        date: Between(budget.startDate, budget.endDate),
      })
      .getRawOne()
      .then((result) => +result.spent)
      .catch(() => 0);

    return {
      ...budget,
      spent,
      percentage: Math.floor((spent / budget.amount) * 100),
    };
  }

  async update(id: number, data: UpdateBudget): Promise<BudgetDto> {
    const category = await this.categoryRepository
      .findOneOrFail(data.category)
      .catch(() => {
        throw new NotFoundException('Category not found');
      });

    await this.budgetRepository.update(id, {
      ...data,
      category,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.budgetRepository.delete(id);
  }

  async getBudgetMovements(budgetId: number): Promise<MovementDto[]> {
    const budget = await this.budgetRepository.findOne(budgetId, {
      relations: ['category'],
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return await this.movementRepository
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
  }

  async generateBudgets(): Promise<void> {
    this.#logger.log('Generating budgets');

    const budgets = await this.budgetRepository.find({
      where: {
        active: true,
        repeat: true,
      },
    });

    const utc = DateTime.utc();
    const startDate = utc.startOf('month').toFormat('yyyy-MM-dd');
    const endDate = utc.endOf('month').toFormat('yyyy-MM-dd');

    this.#logger.log(`Generating budgets for ${startDate} to ${endDate}`);

    for (const budget of budgets) {
      // Create Budget for the month
      await this.budgetRepository
        .save({
          name: budget.name,
          amount: budget.amount,
          category: budget.category,
          repeat: budget.repeat,
          startDate,
          endDate,
        })
        .catch((error) => {
          this.#logger.error(`Error creating budget ${error.message}`);
        });

      // Set current month as inactive
      await this.budgetRepository.update(budget.id, {
        active: false,
      });
    }

    this.#logger.log('Budgets generated');
  }
}
