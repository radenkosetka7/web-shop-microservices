import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'apps/auth-service/src/models/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
