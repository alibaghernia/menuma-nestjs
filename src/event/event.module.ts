import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { EventService } from './services/event.service';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { EventPanelService } from './services/event.panel.service';

@Module({
  imports: [SequelizeModule.forFeature([Event]), AccessControlModule],
  providers: [EventService, EventPanelService],
  controllers: [EventController],
  exports: [EventPanelService, EventService],
})
export class EventModule {}
