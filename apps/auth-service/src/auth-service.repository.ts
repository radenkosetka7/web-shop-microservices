import { Repository } from 'typeorm';
import { User } from './models/entities/user.entity';

export class UsersRepository extends Repository<User> {}
