import { IsNotEmpty, IsString } from 'class-validator';

export class MessageRequest {
  @IsString()
  @IsNotEmpty()
  question: string;
}
