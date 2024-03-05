import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './models/entities/message.entity';
import { MessagesRepository } from './messages-service.repository';
import { MessageRequest } from './models/requests/message.request';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MessagesServiceService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: MessagesRepository,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async createMessage(message: MessageRequest, id: string): Promise<Message> {
    const messageReq = {
      ...message,
      user: id,
    };
    return await this.messagesRepository.save(messageReq);
  }

  async getAll(page: number, pageSize: number): Promise<any> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const messages = await this.messagesRepository.find();
    const selectedMessages = messages.splice(startIndex, endIndex);
    const messagesResp = await Promise.all(
      selectedMessages.map(async (message) => {
        const userInfo = await lastValueFrom(
          this.userClient.send('getUserById', message.user),
        );
        delete userInfo.id;
        return { ...message, user: userInfo };
      }),
    );
    return { messages: messagesResp, total: messages.length };
  }

  async getById(id: string): Promise<any> {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
    if (!message) {
      return { statusCode: 404, message: 'Message does not exist.' };
    }
    const user = await lastValueFrom(
      this.userClient.send('getUserById', message.user),
    );
    delete message.user;
    return { ...message, user: user };
  }

  async readMessage(id: string): Promise<any> {
    const message = await this.messagesRepository.findOne({
      where: { id: id },
    });
    if (!message) {
      return { statusCode: 404, message: 'Message does not exist.' };
    }
    message.status = true;
    this.messagesRepository.save(message);
    return 'Messages successfully updated.';
  }
}
