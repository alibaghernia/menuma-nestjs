import { Module } from '@nestjs/common';
import { BusinessPanelService } from './services/business.panel.service';
import { BusinessController } from './controllers/business.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './entites/business.entity';
import { Social } from 'src/database/entities/social.entity';
import { User } from 'src/users/entites/user.entity';
import { BusinessService } from './services/business.service';
import { BusinessPanelController } from './controllers/business.panel.controller';
import { BusinessUser } from './entites/business_user.entity';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { BusinessTable } from './entites/business_tables.entity';
import { PagerRequest } from './entites/pager_request.entity';
import { PagerRequestgGateway } from './gateways/pager_request.gateway';
import { BusinessHall } from './entites/business_hall.entity';
import { BusinessCategory } from './entites/business_category.entity';
import { TableModule } from './sub_modules/table/table.module';
import { HallModule } from './sub_modules/hall/hall.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Business,
      Social,
      User,
      BusinessUser,
      BusinessCategory,
      BusinessTable,
      PagerRequest,
      BusinessHall,
    ]),
    AccessControlModule,
    TableModule,
    HallModule,
  ],
  providers: [BusinessPanelService, BusinessService, PagerRequestgGateway],
  controllers: [BusinessController, BusinessPanelController],
})
export class BusinessModule {}
