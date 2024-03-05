import { AttributeValueRequest } from './attribute-value.request';

export class SearchRequest {
  category?: string;
  title?: string;
  location?: string;
  productStatus?: boolean;
  priceFrom?: number;
  priceTo?: number;
  attributeValueList?: AttributeValueRequest[];
}
