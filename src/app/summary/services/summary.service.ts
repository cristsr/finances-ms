import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { BalanceEntity, MovementEntity } from 'app/movement/entities';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(BalanceEntity)
    private balanceView: Repository<BalanceEntity>,

    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,
  ) {}

  async summary(): Promise<Record<string, any>> {
    const month = DateTime.local().toFormat('yyyy-MM');

    const balance = await this.balanceView.find();

    return balance;
  }
}
