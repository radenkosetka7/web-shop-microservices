import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
declare const module: any;

async function bootstrap() {
  const fs = require('fs');
  const filePath = process.env.FILE_PATH;
  const keyFile = fs.readFileSync(filePath + '/key.pem');
  const certFile = fs.readFileSync(filePath + '/cert.pem');
  const app = await NestFactory.create(ApiGatewayModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Web Shop')
    .setDescription('Web Shop API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(4000);
}
bootstrap();
