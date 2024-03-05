import { Repository } from 'typeorm';
import { Image } from './models/entities/image.entity';

export class ImagesRepository extends Repository<Image> {}
