import { IsNotEmpty, IsString } from 'class-validator';

export class ImageRequest {
  @IsString()
  @IsNotEmpty()
  productImage: string;
}
