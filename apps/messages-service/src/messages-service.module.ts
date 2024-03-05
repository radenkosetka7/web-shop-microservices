import { Module } from '@nestjs/common';
import { MessagesServiceController } from './messages-service.controller';
import { MessagesServiceService } from './messages-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/entities/message.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/messages-service/.env',
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'messages-database',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [MessagesServiceController],
  providers: [MessagesServiceService],
})
export class MessagesServiceModule {}
