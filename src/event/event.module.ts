import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';
import { AccessControlModule } from 'src/access_control/access_control.module';

@Module({
  imports: [SequelizeModule.forFeature([Event]), AccessControlModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
