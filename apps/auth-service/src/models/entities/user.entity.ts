import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';
import { UserRole } from '../enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 45 })
  firstname: string;
  @Column({ length: 45 })
  lastname: string;
  @Column({ length: 45 })
  city: string;
  @Column({ length: 45, unique: true })
  username: string;
  @Column({ length: 255 })
  password: string;
  @Column({ length: 45, unique: true })
  email: string;
  @Column({ length: 1024, nullable: true })
  avatar: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ORDINARY })
  role: number;
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.REQUESTED })
  status: number;
}
