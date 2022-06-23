import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';
import { MovementType } from 'app/movement/types';

@Entity('scheduled')
export class ScheduledEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  type: MovementType;

  @Column({
    type: 'date',
    name: 'start_date',
  })
  date: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({})
  recurrent: string;

  @ManyToOne(() => CategoryEntity, (e) => e.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
  })
  category: CategoryEntity;

  @ManyToOne(() => SubcategoryEntity, (t: SubcategoryEntity) => t.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'subcategory_id',
  })
  subcategory: SubcategoryEntity;
}
