import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'balance',
  expression: `
    select 
      cast(coalesce(income - expense, 0) as real) as balance, 
      cast(income_month as real), 
      cast(expense_month as real), 
      cast(income_year as real), 
      cast(expense_year as real)
    from (
      select
        sum(case when type = 'income' then amount end) as income,
        sum(case when type = 'expense' then amount end) as expense,
        sum(case when type = 'income' and to_char(now(), 'YYYY-MM') = to_char(date, 'YYYY-MM') then amount end) as income_month,
        sum(case when type = 'expense' and to_char(now(), 'YYYY-MM') = to_char(date, 'YYYY-MM') then amount end) as expense_month,
        sum(case when type = 'income' and to_char(now(), 'YYYY') = to_char(date, 'YYYY') then amount end) as income_year,
        sum(case when type = 'expense' and to_char(now(), 'YYYY') = to_char(date, 'YYYY') then amount end) as expense_year
      from movements
    ) as a
  `,
})
export class BalanceEntity {
  @ViewColumn()
  balance: number;

  @ViewColumn({
    name: 'income_month',
  })
  incomeMonth: number;

  @ViewColumn({
    name: 'expense_month',
  })
  expenseMonth: number;

  @ViewColumn({
    name: 'income_year',
  })
  incomeYear: number;

  @ViewColumn({
    name: 'expense_year',
  })
  expenseYear: number;
}
