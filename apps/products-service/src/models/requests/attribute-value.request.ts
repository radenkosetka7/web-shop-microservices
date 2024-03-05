import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AttributeValueRequest {
  @IsString()
  @IsNotEmpty()
  value: string;
  @IsNumber()
  @IsPositive()
  attributeId: string;
}
