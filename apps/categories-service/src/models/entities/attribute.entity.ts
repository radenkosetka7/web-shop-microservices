import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 45 })
  name: string;
  @Column({ length: 45 })
  type: string;
  @ManyToOne(() => Category, (category) => category.attributes)
  category: Category;
}
