import { Controller } from '@nestjs/common';
import { MessagesServiceService } from './messages-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { Message } from './models/entities/message.entity';

@Controller()
export class MessagesServiceController {
  constructor(
    private readonly messagesServiceService: MessagesServiceService,
  ) {}

  @MessagePattern('createMessage')
  async createMessage(data: any): Promise<Message> {
    const { message, id } = data;
    return await this.messagesServiceService.createMessage(message, id);
  }

  @MessagePattern('getAllMessages')
  async getAll(data: any): Promise<Array<any>> {
    const { page, pageSize } = data;
    return await this.messagesServiceService.getAll(page, pageSize);
  }

  @MessagePattern('getMessage')
  async getById(id: string): Promise<any> {
    return await this.messagesServiceService.getById(id);
  }

  @MessagePattern('readMessage')
  async readMessage(id: string): Promise<any> {
    return await this.messagesServiceService.readMessage(id);
  }
}
