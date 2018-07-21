import * as config from 'config';
import * as cors from 'cors';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppExceptionFilter } from './app.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: true }),
  );
  app.useGlobalFilters(new AppExceptionFilter());
  app.use(cors({ credentials: true, origin: config.get('allowedOrigin') }));

  // TODO: app.useStaticAssets(config.get('uploadDir'));
  app.use('/upload', express.static(config.get('uploadDir')));

  const options = new DocumentBuilder()
    .setTitle('Petman')
    .setDescription('Petman API description')
    .addBearerAuth()
    .setVersion('1.0')
    .setSchemes('http', 'https')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(config.get('port'));
}
bootstrap();
