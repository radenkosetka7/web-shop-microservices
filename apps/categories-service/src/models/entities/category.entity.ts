import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 45 })
  name: string;
  @OneToMany(() => Attribute, (attribute) => attribute.category)
  attributes: Attribute[];
}
