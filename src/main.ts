import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as morgan from 'morgan';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SocketIoAdapter } from './adapters/socket_io.adapter';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const webUrl = process.env.WEB_DOMAIN || 'http://127.0.0.1';
  const url = new URL(webUrl);
  let httpsOptions: NestApplicationOptions['httpsOptions'];
  if (url.protocol.startsWith('https'))
    httpsOptions = {
      key: process.env.SSL_KEY,
      cert: process.env.SSL_CERT,
    };
  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions,
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
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

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
