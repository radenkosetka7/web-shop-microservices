import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth-service/.env',
    }),
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
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'auth-database',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_TOKEN,
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
