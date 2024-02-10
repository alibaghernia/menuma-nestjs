import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PagerRequest } from '../entites/pager_request.entity';

@WebSocketGateway({
  namespace: 'pager_requests',
  cors: {
    origin: '*',
  },
})
export class PagerRequestgGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  connectedClients: Record<string, Socket[]> = {};

  handleDisconnect(client: Socket) {
    console.log('someone disconnected!', { id: client.id });
    const business_uuid = client.handshake.query['business_uuid'] as string;
    if (this.connectedClients[business_uuid])
      this.connectedClients[business_uuid] = this.connectedClients[
        business_uuid
      ].filter((cli) => cli.id != client.id);
  }

  handleConnection(client: Socket) {
    console.log('someone connected!', { id: client.id });
    const business_uuid = client.handshake.query['business_uuid'] as
      | string
      | undefined;
    if (!business_uuid) {
      client.disconnect();
      return;
    }
    if (!this.connectedClients[business_uuid])
      this.connectedClients[business_uuid] = [client];
    else
      this.connectedClients[business_uuid] =
        this.connectedClients[business_uuid].concat(client);
  }

  async broadcastPagerNotification(request: PagerRequest) {
    const business_uuid = request.business_uuid;
    const clients = this.connectedClients[business_uuid] || [];
    for (const client of clients) {
      client.emit('new-request', request);
    }
  }
  async broadcastCancelPagerNotification(
    business_uuid: string,
    request_uuid: string,
  ) {
    const clients = this.connectedClients[business_uuid] || [];
    for (const client of clients) {
      client.emit('cancel-request', request_uuid);
    }
  }
  async broadcastUpdatePagerNotification(business_uuid: string) {
    const clients = this.connectedClients[business_uuid] || [];
    for (const client of clients) {
      client.emit('update-requests');
    }
  }
}
