import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  app.use(morgan('tiny'));
  // public static images
  app.use(
    '/images',
    express.static(
      join(__dirname, '..', configService.get('IMAGES_PATH', 'static/images')),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.useWebSocketAdapter(new IoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('menuma api docs')
    .setDescription('this is menuma api docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const host = configService.get<string>('SERVER_HOST', '127.0.0.1');
  const port = configService.get<number>('SERVER_PORT', 3000);

  await app.listen(port, host, () =>
    console.log(`app is listening on: ${host}:${port}`),
  );
}
bootstrap();
