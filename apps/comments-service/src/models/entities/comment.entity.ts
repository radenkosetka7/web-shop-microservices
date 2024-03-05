import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 255 })
  question: string;
  @Column({ length: 255, default: null })
  answer: string;
  @Column({ type: 'date' })
  creationDate: string;
  @Column('uuid')
  user: string;
  @Column('uuid')
  product: string;
}
