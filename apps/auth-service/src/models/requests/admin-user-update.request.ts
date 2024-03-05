import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseUserRequest } from './base-user.request';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class AdminUpdateUserRequest extends BaseUserRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEnum(UserRole)
  role: UserRole;
  @IsEnum(UserStatus)
  status: UserStatus;
}
