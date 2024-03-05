import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ImageRequest } from './image.request';
import { AttributeValueRequest } from './attribute-value.request';

export class ProductRequest {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsBoolean()
  isNew: boolean;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  contact: string;
  @IsString()
  @IsNotEmpty()
  category: string;
  @IsArray()
  @ArrayNotEmpty()
  images: ImageRequest[];
  @IsArray()
  @ArrayNotEmpty()
  attributeValues: AttributeValueRequest[];
}
