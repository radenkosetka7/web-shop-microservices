import { Module } from '@nestjs/common';
import { CommentsServiceController } from './comments-service.controller';
import { CommentsServiceService } from './comments-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './models/entities/comment.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/comments-service/.env',
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
      host: 'comments-database',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [CommentsServiceController],
  providers: [CommentsServiceService],
})
export class CommentsServiceModule {}
