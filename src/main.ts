import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as express from 'express';
import * as passport from 'passport';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { join } from 'path';

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

  const redisClient = createClient({
    socket: {
      host: configService.get('REDIS_HOST', '127.0.0.1'),
      port: configService.get<number>('REDIS_PORT', 6379),
    },
  });
  redisClient.connect().catch(console.error);
  //@ts-ignore
  const redisStore = new RedisStore({
    //@ts-ignore
    client: redisClient as any,
    prefix: 'menuma:',
  });

  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_SECRET'),
      resave: configService.get<boolean>('SESSION_RESAVE'),
      saveUninitialized: configService.get<boolean>(
        'SESSION_SAVE_UNINITIALIZED',
      ),
      cookie: { maxAge: configService.get<number>('SESSION_COOKIE_MAX_AGE') },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const host = configService.get<string>('SERVER_HOST', '127.0.0.1');
  const port = configService.get<number>('SERVER_PORT', 3000);

  await app.listen(port, host, () =>
    console.log(`app is listening on: ${host}:${port}`),
  );
}
bootstrap();
