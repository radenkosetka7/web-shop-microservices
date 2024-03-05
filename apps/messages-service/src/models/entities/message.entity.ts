import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 255 })
  question: string;
  @Column({ default: false })
  status: boolean;
  @Column('uuid')
  user: string;
}
