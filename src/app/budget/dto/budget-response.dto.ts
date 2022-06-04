import { CategoryDto } from 'app/category/dto';

export class BudgetDto {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  amount: number;
  spent: number;
  repeat: boolean;
  active: boolean;
  percentage: number;
  category: CategoryDto;
}
