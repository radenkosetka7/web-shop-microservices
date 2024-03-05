import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailsServiceService {
  constructor(private readonly mailerService: MailerService) {}

  async replyMessage(
    email: string,
    question: string,
    answer: string,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'WebShop - Customer Support Reply',
        text: 'Reply on: ' + question + '\n' + '\n' + answer,
      });
      return 'E-mail is successfully sent.';
    } catch (error) {
      return {
        statusCode: 500,
        message: 'An error occurred while sending e-mail.',
      };
    }
  }

  async sendActivationCode(email: string, code: string): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '"WebShop - Verification"',
        text: 'Welcome to WebShopIP application \n\nACTIVATION CODE: ' + code,
      });
      return 'E-mail is successfully sent.';
    } catch (error) {
      return {
        statusCode: 500,
        message: 'An error occurred while sending e-mail.',
      };
    }
  }
}
