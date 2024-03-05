import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './util/exception-handler';
import { TransformResponseInterceptor } from './util/transform-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
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
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'COMMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'CATEGORY_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_TOKEN,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    AllExceptionsFilter,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class ApiGatewayModule {}
