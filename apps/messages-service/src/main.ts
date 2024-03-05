import { NestFactory } from '@nestjs/core';
import { MessagesServiceModule } from './messages-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MessagesServiceModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'redis',
        port: 6379,
      },
    },
  );
  await app.listen();
}
bootstrap();
