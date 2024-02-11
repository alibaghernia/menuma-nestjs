import { Module } from '@nestjs/common';
import { RequestsPanelService } from './services/requests.panel.service';
import { RequestsPanelController } from './controllers/requests.panel.controller';
import { RequestsController } from './controllers/requests.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Request } from './entities/request.entity';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { RequestsService } from './services/requests.service';

@Module({
  imports: [SequelizeModule.forFeature([Request]), AccessControlModule],
  providers: [RequestsService, RequestsPanelService],
  controllers: [RequestsPanelController, RequestsController],
})
export class RequestsModule {}
