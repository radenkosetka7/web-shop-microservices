import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseUserRequest } from './base-user.request';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../enums/user-role.enum';

export class AdminCreateUserRequest extends BaseUserRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsEnum(UserRole)
  role: UserRole;
  @IsEnum(UserStatus)
  status: UserStatus;
}
