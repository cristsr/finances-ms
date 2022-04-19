import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { MovementEntity } from 'app/movement/entities';
import { BalanceEntity, SummaryEntity } from 'app/summary/entities';
import { DateTime } from 'luxon';

@Injectable()
export class SummaryService {
  private logger = new Logger(SummaryService.name);

  constructor(
    private connection: Connection,

    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,

    @InjectRepository(SummaryEntity)
    private summaryRepository: Repository<SummaryEntity>,

    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,
  ) {}

  async summary(): Promise<Record<string, any>> {
    const balance = await this.balanceRepository.findOne();
    const pie = await this.generateExpensesByPeriod();
    const bar = await this.generateExpensesByWeek();
    const latestMovements = await this.getLatestMovements();

    return {
      balance,
      pie,
      bar,
      latestMovements,
    };
  }

  private async generateExpensesByPeriod(): Promise<any> {
    try {
      const daily = await this.summaryRepository
        .createQueryBuilder()
        .select('cast(SUM(amount) as real) as amount, name, color')
        .where('date = current_date')
        .groupBy('amount, name, color')
        .orderBy('amount', 'DESC')
        .take(5)
        .getRawMany();

      const weekly = await this.summaryRepository
        .createQueryBuilder()
        .select('cast(SUM(amount) as real) as amount, name, color')
        .where(
          `to_char(date, 'YYYY-MM-W') = to_char(current_date, 'YYYY-MM-W')`,
        )
        .groupBy('amount, name, color')
        .orderBy('amount', 'DESC')
        .take(5)
        .getRawMany();

      const monthly = await this.summaryRepository
        .createQueryBuilder()
        .select('cast(SUM(amount) as real) as amount, name, color')
        .groupBy('amount, name, color')
        .orderBy('amount', 'DESC')
        .take(5)
        .getRawMany();

      return {
        daily,
        weekly,
        monthly,
      };
    } catch (e) {
      this.logger.error(`Error generating pie stats: ${e.message}`);
      throw new UnprocessableEntityException(e.message);
    }
  }

  private async generateExpensesByWeek(): Promise<any> {
    const today = DateTime.local();

    const days = new Array(7).fill(0).map((_, i: number) => ({
      locale: today.minus({ days: i }).toLocaleString({ weekday: 'short' }),
      format: today.minus({ days: i }).toFormat('yyyy-MM-dd'),
    }));

    const result = [];

    for (const day of days) {
      const query = this.summaryRepository
        .createQueryBuilder()
        .select('cast(SUM(amount) as real)', 'amount')
        .where(`date = :date`, { date: day.format });

      try {
        const record = await query.getRawOne();

        result.push({
          day: day.locale,
          amount: record?.amount ?? 0,
        });
      } catch (e) {
        this.logger.error(`Error generating bar stats: ${e.message}`);

        result.push({
          day: day.locale,
          amount: 0,
        });
      }
    }

    return result;
  }

  getLatestMovements(): Promise<MovementEntity[]> {
    return this.movementRepository.find({
      relations: ['category', 'subcategory'],
      order: {
        date: 'DESC',
      },
      take: 5,
    });
  }
}
