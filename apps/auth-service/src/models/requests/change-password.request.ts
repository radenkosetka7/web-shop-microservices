import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
