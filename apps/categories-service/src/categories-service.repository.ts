import { Repository } from 'typeorm';
import { Category } from './models/entities/category.entity';

export class CategoriesRepository extends Repository<Category> {}
