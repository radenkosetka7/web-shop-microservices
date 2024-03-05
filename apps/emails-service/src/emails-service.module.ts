import { Module } from '@nestjs/common';
import { EmailsServiceController } from './emails-service.controller';
import { EmailsServiceService } from './emails-service.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/emails-service/.env',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      },
    }),
  ],
  controllers: [EmailsServiceController],
  providers: [EmailsServiceService],
})
export class EmailsServiceModule {}
