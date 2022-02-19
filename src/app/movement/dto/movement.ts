import { Type } from '@nestjs/common';

export interface Movement {
  id?: string;
  date: Date | string;
  description: string;
  amount: number;
  category: string | Type;
  subcategory: string | Type;
}
