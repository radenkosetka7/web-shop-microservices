import { IsNotEmpty, IsString } from 'class-validator';

export abstract class AttributeRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  type: string;
}
