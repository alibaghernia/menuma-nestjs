import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { WebPushService } from './web_push.service';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';

@Controller('/panel/business/:business_uuid/web-push')
@UsePipes(new UUIDCheckerController('Business UUID', 'busness_uuid'))
export class WebPushController {
  constructor(private webPushService: WebPushService) {}

  @Post('/subscribe')
  subscribe(
    @Param('business_uuid') business_uuid: string,
    @Body() subscribe: any,
  ) {
    this.webPushService.subscribe(business_uuid, subscribe);
    return {
      ok: true,
      message: 'Subscription was successful!',
    };
  }
  @Get('/send-notification')
  send(@Param('business_uuid') business_uuid: string) {
    this.webPushService.sendPushNotification(business_uuid, 'hey');
    return {
      ok: true,
      message: 'Send notification was successful!',
    };
  }
}
