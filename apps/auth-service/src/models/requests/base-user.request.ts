import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export abstract class BaseUserRequest {
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsOptional()
  avatar?: string;
  @IsEmail()
  email: string;
}
