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

@Entity('movements')
export class MovementEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  date: Date;

  @Column({ nullable: true })
  type: 'ingreso' | 'egreso';

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

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: {
      from: (date: Date) => DateTime.fromJSDate(date).setZone('America/Bogota'),
      to: (date: string) => date,
    },
  })
  createdAt: Date;
}
