import { ArrayNotEmpty, IsArray } from 'class-validator';
import { CategoryRequest } from './category.request';
import { CreateAttributeRequest } from './create-attribute.request';

export class CreateCategoryRequest extends CategoryRequest {
  @IsArray()
  @ArrayNotEmpty()
  attributes: CreateAttributeRequest[];
}
