import { User } from 'apps/auth-service/src/models/entities/user.entity';

export class CommentResponse {
  id: string;
  question: string;
  answer: string;
  user: User;
  creationDate: string;
}
