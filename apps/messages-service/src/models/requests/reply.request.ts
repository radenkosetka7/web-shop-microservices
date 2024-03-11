import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ReplyRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  mail: string;
  @IsString()
  @IsNotEmpty()
  question: string;
  @IsString()
  @IsNotEmpty()
  answer: string;
}
