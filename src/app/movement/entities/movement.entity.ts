import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity, SubcategoryEntity } from 'app/category/entities';
import { DateTime } from 'luxon';
import { MovementType } from 'app/movement/types';
import { optTransformer } from 'database/utils';

@Entity('movements')
export class MovementEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  date: string;

  @Column({ nullable: true })
  type: MovementType;

  @Column()
  description: string;

  @Column()
  amount: number;

  @ManyToOne(() => CategoryEntity, (t: CategoryEntity) => t.id, {
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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    transformer: optTransformer({
      from: (date: Date) => {
        return DateTime.fromJSDate(date).setZone('America/Bogota').toString();
      },
    }),
  })
  createdAt: Date;
}
