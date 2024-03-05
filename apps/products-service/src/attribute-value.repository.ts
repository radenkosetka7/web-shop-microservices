import { Repository } from 'typeorm';
import { AttributeValue } from './models/entities/attribute-value.entity';

export class AttributeValuesRepository extends Repository<AttributeValue> {}
