import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from 'app/category/entities';

@Entity('scheduled')
export class ScheduledEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column({
    type: 'date',
    name: 'start_date',
  })
  date: string;

  @Column()
  repeat: boolean;

  @ManyToOne(() => CategoryEntity, (e) => e.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
  })
  category: CategoryEntity;
}
