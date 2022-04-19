import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'summary',
  expression: `
    select 
      m.id,
      m.amount,
      c.name,
      c.color,
      m.date
    from movements m left join categories c on m.category_id = c.id
    where m.type = 'expense' and to_char(m.date, 'YYYY-MM') = to_char(current_date, 'YYYY-MM')
  `,
})
export class SummaryEntity {
  @ViewColumn()
  id: number;

  @ViewColumn()
  amount: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  color: string;

  @ViewColumn()
  date: Date;
}
