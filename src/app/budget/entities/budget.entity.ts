import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from 'app/category/entities';

@Entity('budgets')
export class BudgetEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  month: string;

  @ManyToOne(() => CategoryEntity, (c) => c.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
