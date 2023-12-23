import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(_, options?: ServerOptions) {
    const port = this.configService.get('WEBSOCKET_SERVER_PORT', 3001);
    options.cors = {
      origin: '*',
    };
    const server = super.createIOServer(port, options);
    return server;
  }
}
