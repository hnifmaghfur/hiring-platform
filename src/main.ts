import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './common/app-logger';
import { APP_CONFIG, CORS_CONFIG } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  // Serve static files from /uploads
  console.log('Serving uploads from:', join(process.cwd(), 'uploads'));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Global prefix
  app.setGlobalPrefix(APP_CONFIG.API_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Hiring Platform API')
    .setDescription('API documentation for the Hiring Platform')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${APP_CONFIG.API_PREFIX}/docs`, app, document);

  // CORS
  app.enableCors({
    origin: CORS_CONFIG.ORIGIN,
    methods: CORS_CONFIG.METHODS,
    credentials: CORS_CONFIG.CREDENTIALS,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(APP_CONFIG.PORT);
  const logger = new CustomLogger();
  logger.log(
    `🚀 Application is running on: http://localhost:${APP_CONFIG.PORT}/${APP_CONFIG.API_PREFIX}`,
  );
  logger.log(`📊 Environment: ${APP_CONFIG.NODE_ENV}`);
}
bootstrap();
