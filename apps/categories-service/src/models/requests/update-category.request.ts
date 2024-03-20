import { CategoryRequest } from './category.request';
import { CreateAttributeRequest } from './create-attribute.request';
import { UpdateAttributeRequest } from './update-attribute.request';

export class UpdateCategoryRequest extends CategoryRequest {
  addedAttributes: CreateAttributeRequest[];
  deletedAttributes: UpdateAttributeRequest[];
  updatedAttributes: UpdateAttributeRequest[];
}
