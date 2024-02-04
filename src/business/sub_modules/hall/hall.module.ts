import { Module } from '@nestjs/common';
import { HallService } from './services/hall.service';
import { HallPanelService } from './services/hall.panel.service';
import { HallPanelController } from './controllers/hall.panel.controller';
import { HallController } from './controllers/hall.controller';
import { BusinessHall } from 'src/business/entites/business_hall.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';

@Module({
  imports: [SequelizeModule.forFeature([BusinessHall, Business])],
  providers: [HallPanelService, HallService],
  controllers: [HallPanelController, HallController],
})
export class HallModule {}
