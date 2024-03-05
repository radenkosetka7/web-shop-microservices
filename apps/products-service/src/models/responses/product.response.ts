import { Image } from '../entities/image.entity';
import { CommentResponse } from 'apps/comments-service/src/models/responses/comment.response';
import { Category } from 'apps/categories-service/src/models/entities/category.entity';
import { AttributeValueResponse } from './attribute-value.response';
import { AttributeValue } from '../entities/attribute-value.entity';

export class ProductResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  isNew: boolean;
  city: string;
  contact: string;
  creationDate: string;
  finished: number;
  userSeller: string;
  userBuyer: string;
  category: Category | string;
  images: Image[];
  attributeValues: AttributeValueResponse[] | AttributeValue[];
  comments: CommentResponse[];
}
