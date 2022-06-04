import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'summary',
  expression: `
    select 
      m.id,
      m.amount,
      c.name,
      c.color,
      c.icon,
      m.date
    from movements m left join categories c on m.category_id = c.id where m.type = 'expense'
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
