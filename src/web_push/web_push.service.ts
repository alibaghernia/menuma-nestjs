import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';

@Injectable()
export class WebPushService {
  private subscribers: Record<string, webpush.PushSubscription[]> = {};

  constructor(configService: ConfigService) {
    const publicKey = configService.get('WEB_PUSH_PUBLIC_KEY');
    const privateKey = configService.get('WEB_PUSH_PRIVATE_KEY');
    if (!publicKey || !privateKey) {
      console.error('Check web-push keys!');
      process.exit(1);
    }
    webpush.setVapidDetails('https://menuma.online', publicKey, privateKey);
  }

  subscribe(business_uuid: string, subs: any) {
    if (!this.subscribers[business_uuid]) this.subscribers[business_uuid] = [];
    this.subscribers[business_uuid].push(
      JSON.parse(Object.entries(subs)[0][0]),
    );
  }

  sendPushNotification(business_uuid: string, data: string) {
    if (!this.subscribers[business_uuid]) return;
    const notificationPayload = {
      title: 'New Notification',
      body: 'This is a new notification',
      icon: 'https://some-image-url.jpg',
      data: data,
    };
    this.subscribers[business_uuid].forEach((subs) => {
      webpush.sendNotification(subs, JSON.stringify(notificationPayload));
    });
  }
}
