import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';

@Entity('movements')
export class MovementEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @Column()
  description: string;

  @Column()
  amount: number;

  @ManyToOne(() => CategoryEntity, (t: CategoryEntity) => t.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  category: CategoryEntity;

  @ManyToOne(() => SubcategoryEntity, (t: SubcategoryEntity) => t.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  subcategory: SubcategoryEntity;
}
