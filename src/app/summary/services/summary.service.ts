import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { MovementEntity } from 'app/movement/entities';
import { BalanceEntity, SummaryEntity } from 'app/summary/entities';
import { ExpenseDto, ExpensesDto } from 'app/summary/dto';

@Injectable()
export class SummaryService {
  #logger = new Logger(SummaryService.name);

  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,

    @InjectRepository(SummaryEntity)
    private summaryRepository: Repository<SummaryEntity>,

    @InjectRepository(MovementEntity)
    private movementRepository: Repository<MovementEntity>,
  ) {}

  balance(): Promise<BalanceEntity> {
    return this.balanceRepository.findOne();
  }

  async expenses(date: DateTime): Promise<ExpensesDto> {
    let where: string;

    const today = date.toSQLDate();
    const start = date.startOf('week').toSQLDate();
    const end = date.endOf('week').toSQLDate();

    where = `m.date = '${today}'`;
    const day = await this.expensesQuery(where);

    where = `date BETWEEN '${start}'::date AND '${end}'::date`;
    const week = await this.expensesQuery(where);

    where = `to_char(m.date, 'YYYY-MM') = to_char('${today}'::date, 'YYYY-MM')`;
    const month = await this.expensesQuery(where);

    return {
      day,
      week,
      month,
    };
  }

  expensesQuery(where: string): Promise<ExpenseDto[]> {
    const query = this.movementRepository
      .createQueryBuilder('m')
      .select('SUM(m.amount)::float', 'amount')
      .innerJoinAndSelect('m.category', 'c')
      .where(where)
      .andWhere(`m.type = 'expense'`)
      .groupBy('c.id, c.name, c.color, c.icon')
      .orderBy('amount', 'DESC')
      .limit(5);

    return query.getRawMany().then((data) => {
      const total = data.reduce((acc, cur) => acc + cur.amount, 0);

      return data.map<ExpenseDto>((item) => ({
        amount: item.amount,
        percentage: Math.round((item.amount / total) * 100),
        category: {
          id: item.c_id,
          name: item.c_name,
          color: item.c_color,
          icon: item.c_icon,
        },
      }));
    });
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

  // TODO: reimplement
  async generateExpensesByWeek(): Promise<any> {
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
        this.#logger.error(`Error generating bar stats: ${e.message}`);

        result.push({
          day: day.locale,
          amount: 0,
        });
      }
    }

    return result;
  }
}
