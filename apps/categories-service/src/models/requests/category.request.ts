import { IsNotEmpty, IsString } from 'class-validator';

export abstract class CategoryRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
