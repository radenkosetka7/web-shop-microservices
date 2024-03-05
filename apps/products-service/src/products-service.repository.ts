import { Repository } from 'typeorm';
import { Product } from './models/entities/product.entity';

export class ProductsRepository extends Repository<Product> {}
