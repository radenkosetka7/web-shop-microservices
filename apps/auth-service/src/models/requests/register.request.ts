import { IsNotEmpty, IsString } from 'class-validator';
import { BaseUserRequest } from './base-user.request';

export class RegisterRequest extends BaseUserRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
