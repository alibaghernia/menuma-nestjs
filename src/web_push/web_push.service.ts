import { Injectable } from '@nestjs/common';
import * as webpush from 'web-push';

@Injectable()
export class WebPushService {
  private subscribers: Record<string, webpush.PushSubscription[]> = {};

  constructor() {}

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
