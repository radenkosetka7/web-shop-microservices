import { Controller } from '@nestjs/common';
import { EmailsServiceService } from './emails-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class EmailsServiceController {
  constructor(private readonly emailsServiceService: EmailsServiceService) {}

  @MessagePattern('replyMessage')
  async replyMessage(data: any): Promise<any> {
    const { mail, question, answer } = data;
    return await this.emailsServiceService.replyMessage(mail, question, answer);
  }

  @MessagePattern('activationCode')
  async sendActivationCode(data: any): Promise<any> {
    const { email, code } = data;
    return await this.emailsServiceService.sendActivationCode(email, code);
  }
}
