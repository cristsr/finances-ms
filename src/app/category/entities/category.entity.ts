import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubcategoryEntity } from './subcategory.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  color: string;

  @OneToMany(() => SubcategoryEntity, (x: SubcategoryEntity) => x.category)
  subcategories: SubcategoryEntity[];
}
