import { Module } from '@nestjs/common';
import { AccessControlController } from './access_control.controller';
import { AccessControlService } from './access_control.service';

@Module({
  controllers: [AccessControlController],
  providers: [AccessControlService],
})
export class AccessControlModule {}
