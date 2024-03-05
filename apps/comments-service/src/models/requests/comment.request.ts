import { IsNotEmpty, IsString } from 'class-validator';

export class CommentRequest {
  @IsString()
  @IsNotEmpty()
  question: string;
}
