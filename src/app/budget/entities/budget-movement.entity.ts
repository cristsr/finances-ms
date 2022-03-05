import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetEntity } from './budget.entity';
import { MovementEntity } from 'app/movement/entities';

@Entity('budgets_movements')
export class BudgetMovementEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => BudgetEntity, (e: BudgetEntity) => e.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'budget_id' })
  budget: BudgetEntity;

  @ManyToOne(() => MovementEntity, (e: MovementEntity) => e.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'movement_id' })
  movement: MovementEntity;
}
