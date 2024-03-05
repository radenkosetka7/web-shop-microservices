import { User } from '../entities/user.entity';

export class AdminUserResponse {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  city: string;
  avatar: string;
  email: string;
  role: string;
  status: string;

  constructor(user: User) {
    Object.assign(this, { ...user });
  }
}
