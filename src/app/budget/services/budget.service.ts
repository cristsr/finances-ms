import { Injectable } from '@nestjs/common';
import { UpdateBudgetDto, CreateBudgetDto } from 'app/budget/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetEntity, BudgetMovementEntity } from 'app/budget/entities';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private budgetRepository: Repository<BudgetEntity>,

    @InjectRepository(BudgetMovementEntity)
    private budgetMovementRepository: Repository<BudgetMovementEntity>,
  ) {}

  create(createBudgetDto: CreateBudgetDto) {
    return 'This action adds a new budget';
  }

  findAll() {
    return `This action returns all budget`;
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
