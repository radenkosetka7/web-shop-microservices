import { IsNotEmpty, IsString } from 'class-validator';

export class CommentAnswerRequest {
  @IsString()
  @IsNotEmpty()
  answer: string;
}
