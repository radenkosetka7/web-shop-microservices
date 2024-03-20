import { IsNotEmpty, IsString } from 'class-validator';
import { AttributeRequest } from './attribute.request';

export class UpdateAttributeRequest extends AttributeRequest {
  @IsString()
  @IsNotEmpty()
  id: string;
}
