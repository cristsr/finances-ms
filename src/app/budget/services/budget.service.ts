import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBudgetDto, CreateBudgetDto, BudgetDto } from 'app/budget/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetEntity, BudgetMovementEntity } from 'app/budget/entities';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { CategoryEntity } from 'app/category/entities';
import { MovementEntity } from 'app/movement/entities';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private budgetRepository: Repository<BudgetEntity>,

    @InjectRepository(BudgetMovementEntity)
    private budgetMovementRepository: Repository<BudgetMovementEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
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
    // TODO: Refactor this to use a join query with the needed data
    const budgetsRecords: BudgetEntity[] = await this.budgetRepository
      .find({
        relations: ['category', 'budgetMovements', 'budgetMovements.movement'],
        where: {
          active: true,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });

    return budgetsRecords.map<BudgetDto>(({ budgetMovements, ...budget }) => {
      const spent = budgetMovements.reduce((acc, { movement }) => {
        return acc + movement?.amount || 0;
      }, 0);

      return {
        ...budget,
        spent,
      };
    });
  }

  async createBudgetMovement(movement: MovementEntity): Promise<void> {
    const budget = await this.budgetRepository.findOne({
      category: movement.category,
      active: true,
    });

    if (!budget) {
      return;
    }

    await this.budgetMovementRepository
      .save({
        budget,
        movement,
      })
      .catch((error) => {
        console.log(error);
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
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
}
