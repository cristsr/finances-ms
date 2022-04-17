import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
      select incomes - expenses as total
      from (select sum(amount) as incomes from movements where type = 'income') i,
           (select sum(amount) as expenses from movements where type = 'expense') e
  `,
})
export class BalanceEntity {
  @ViewColumn()
  total: number;
}
