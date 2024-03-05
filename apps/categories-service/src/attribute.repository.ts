import { Repository } from 'typeorm';
import { Attribute } from './models/entities/attribute.entity';

export class AttributesRepository extends Repository<Attribute> {}
