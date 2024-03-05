import { Repository } from 'typeorm';
import { Comment } from './models/entities/comment.entity';

export class CommentsRepository extends Repository<Comment> {}
