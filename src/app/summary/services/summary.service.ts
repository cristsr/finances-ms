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
    const pieStats = await this.generatePieStats();
    const barStats = await this.generateBarStats();

    return { balance, pieStats, barStats };
  }

  private async generatePieStats(): Promise<any> {
    try {
      const daily = await this.summaryRepository
        .createQueryBuilder()
        .select('SUM(amount) as amount, name, color')
        .where('date = current_date')
        .groupBy('amount, name, color')
        .getRawMany();

      const weekly = await this.summaryRepository
        .createQueryBuilder()
        .select('SUM(amount) as amount, name, color')
        .where(
          `to_char(date, 'YYYY-MM-W') = to_char(current_date, 'YYYY-MM-W')`,
        )
        .groupBy('amount, name, color')
        .getRawMany();

      const monthly = await this.summaryRepository
        .createQueryBuilder()
        .select('SUM(amount) as amount, name, color')
        .groupBy('amount, name, color')
        .getRawMany();

      return { daily, weekly, monthly };
    } catch (e) {
      this.logger.error(`Error generating pie stats: ${e.message}`);
      throw new UnprocessableEntityException(e.message);
    }
  }

  private async generateBarStats(): Promise<any> {
    const today = DateTime.local();

    const daysAgo = new Array(7).fill(0).map((_, i: number) => ({
      locale: today.minus({ days: i }).toLocaleString({ weekday: 'short' }),
      format: today.minus({ days: i }).toFormat('yyyy-MM-dd'),
    }));

    const result = [];

    for (const day of daysAgo) {
      const query = this.summaryRepository
        .createQueryBuilder()
        .select('cast(SUM(amount) as real)', 'amount')
        .where(`date = :date`, { date: day.format })
        .groupBy('amount, name, color')
        .getRawOne();

      try {
        const record = await query;

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
