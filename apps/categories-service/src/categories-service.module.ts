import { Module } from '@nestjs/common';
import { CategoriesServiceController } from './categories-service.controller';
import { CategoriesServiceService } from './categories-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './models/entities/category.entity';
import { Attribute } from './models/entities/attribute.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/categories-service/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'categories-database',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
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
    TypeOrmModule.forFeature([Category, Attribute]),
  ],
  controllers: [CategoriesServiceController],
  providers: [CategoriesServiceService],
})
export class CategoriesServiceModule {}
