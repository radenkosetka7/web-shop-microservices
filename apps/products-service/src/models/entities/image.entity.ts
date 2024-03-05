import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 1024 })
  productImage: string;
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
