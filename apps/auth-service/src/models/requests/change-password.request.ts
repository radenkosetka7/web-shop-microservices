import { Equals, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  @Equals('password', { message: 'Passwords must match' })
  confirmPassword: string;
}
