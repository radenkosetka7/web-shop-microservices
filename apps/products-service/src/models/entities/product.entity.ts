import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from './image.entity';
import { AttributeValue } from './attribute-value.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 45 })
  title: string;
  @Column({ length: 1000 })
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column()
  isNew: boolean;
  @Column({ length: 45 })
  city: string;
  @Column({ length: 45 })
  contact: string;
  @Column({ type: 'date' })
  creationDate: string;
  @Column({ type: 'smallint', default: 0 })
  finished: number;
  @Column('uuid')
  userSeller: string;
  @Column({ type: 'uuid', default: null })
  userBuyer: string;
  @Column({ type: 'uuid' })
  category: string;
  @OneToMany(() => Image, (image) => image.product)
  images: Image[];
  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.product)
  attributeValues: AttributeValue[];
}
