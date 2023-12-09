import { Module } from '@nestjs/common';
import { BusinessPanelService } from './services/business.panel.service';
import { BusinessController } from './controllers/business.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './entites/business.entity';
import { Social } from 'src/database/entities/social.entity';
import { User } from 'src/users/entites/user.entity';
import { BusinessService } from './services/business.service';
import { BusinessPanelController } from './controllers/business.panel.controller';

@Module({
  imports: [SequelizeModule.forFeature([Business, Social, User])],
  providers: [BusinessPanelService, BusinessService],
  controllers: [BusinessController, BusinessPanelController],
})
export class BusinessModule {}
