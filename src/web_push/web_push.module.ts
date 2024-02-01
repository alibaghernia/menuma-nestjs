import { DynamicModule, Module } from '@nestjs/common';
import { WebPushController } from './web_push.controller';
import { WebPushService } from './web_push.service';

@Module({})
export class WebPushModule {
  static register(): DynamicModule {
    return {
      module: WebPushModule,
      global: true,
      controllers: [WebPushController],
      providers: [WebPushService],
      exports: [WebPushService],
    };
  }
}
