import { Module } from '@nestjs/common';
import { ProductsServiceController } from './products-service.controller';
import { ProductsServiceService } from './products-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/entities/product.entity';
import { Image } from './models/entities/image.entity';
import { ProductsRepository } from './products-service.repository';
import { ImagesRepository } from './images-service.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttributeValue } from './models/entities/attribute-value.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products-service/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'products-database',
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
        name: 'CATEGORY_SERVICE',
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
    TypeOrmModule.forFeature([Product, Image, AttributeValue]),
  ],
  controllers: [ProductsServiceController],
  providers: [ProductsServiceService, ProductsRepository, ImagesRepository],
})
export class ProductsServiceModule {}
