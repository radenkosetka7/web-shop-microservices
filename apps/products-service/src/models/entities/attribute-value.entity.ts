import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class AttributeValue {
  @PrimaryColumn('uuid')
  productId: string;
  @ManyToOne(() => Product, (product) => product.attributeValues)
  @JoinColumn({ name: 'productId' })
  product: Product;
  @PrimaryColumn('uuid')
  attributeId: string;
  @Column({ length: 45 })
  value: string;
}
