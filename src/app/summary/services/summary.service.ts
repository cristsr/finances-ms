import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { MovementEntity } from 'app/movement/entities';
import { BalanceEntity, SummaryEntity } from 'app/summary/entities';

@Injectable()
export class SummaryService {
  private logger = new Logger(SummaryService.name);

  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,

    @InjectRepository(SummaryEntity)
    private summaryRepository: Repository<SummaryEntity>,

    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,
  ) {}

  async summary(): Promise<Record<string, any>> {
    const balance = await this.balanceRepository.findOne();
    const expenses = await this.expenses();
    const lastMovements = await this.lastMovements();

    return {
      balance,
      expenses,
      lastMovements,
      // bar,
    };
  }

  balance(): Promise<BalanceEntity> {
    return this.balanceRepository.findOne();
  }

  async expenses(): Promise<any> {
    try {
      const mapSummary = (data: any[]) => {
        const total = data.reduce((acc, cur) => acc + cur.amount, 0);

        return data.map((item) => ({
          amount: item.amount,
          name: item.name,
          color: item.color,
          icon: item.icon,
          percentage: Math.round((item.amount / total) * 100),
        }));
      };

      const daily = await this.summaryRepository
        .createQueryBuilder()
        .select('SUM(amount)::float as amount, name, color, icon')
        .where('date = current_date')
        .groupBy('name, color, icon')
        .orderBy('amount', 'DESC')
        .take(5)
        .getRawMany()
        .then(mapSummary);

      const weekly = await this.summaryRepository
        .createQueryBuilder()
        .select('SUM(amount)::float as amount, name, color, icon')
        .where(
          `to_char(date, 'YYYY-MM-W') = to_char(current_date, 'YYYY-MM-W')`,
        )
        .groupBy('name, color, icon')
        .orderBy('amount', 'DESC')
        .take(5)
        .getRawMany()
        .then(mapSummary);

      const monthly = await this.summaryRepository
        .createQueryBuilder()
        .select('SUM(amount)::float as amount, name, color, icon')
        .where(`to_char(date, 'YYYY-MM') = to_char(current_date, 'YYYY-MM')`)
        .groupBy('name, color, icon')
        .orderBy('amount', 'DESC')
        .take(5)
        .getRawMany()
        .then(mapSummary);

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

  lastMovements(): Promise<MovementEntity[]> {
    return this.movementRepository.find({
      relations: ['category', 'subcategory'],
      order: {
        date: 'DESC',
      },
      take: 5,
    });
  }

  /**
   * @Deprecated
   */
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
}
