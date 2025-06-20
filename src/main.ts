import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './common/app-logger';
import { APP_CONFIG, CORS_CONFIG } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

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

  // // Log request body
  // app.use((req: Request, res, next) => {
  //   console.log(`[${req.method}] ${req.originalUrl} :`, req);
  //   next();
  // });

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
