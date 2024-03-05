import { Repository } from 'typeorm';
import { Message } from './models/entities/message.entity';

export class MessagesRepository extends Repository<Message> {}
