import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { JoinColumn } from 'typeorm';

@Entity('subcategories')
export class SubcategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CategoryEntity, (t: CategoryEntity) => t.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: CategoryEntity;
}
