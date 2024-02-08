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
import { PagerRequest } from './entites/pager_request.entity';
import { PagerRequestgGateway } from './gateways/pager_request.gateway';
import { BusinessCategory } from './entites/business_category.entity';
import { TableModule } from './sub_modules/table/table.module';
import { HallModule } from './sub_modules/hall/hall.module';
import { EventPanelController } from './controllers/events/event.panel.controller';
import { EventModule } from 'src/event/event.module';
import { CustomersModule } from 'src/customers/customers.module';
import { CustomersController } from './controllers/customer_club/customers/customers.controller';
import { CustomersPanelController } from './controllers/customer_club/customers/customers.panel.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Business,
      Social,
      User,
      BusinessUser,
      BusinessCategory,
      PagerRequest,
    ]),
    EventModule,
    CustomersModule,
    AccessControlModule,
    TableModule,
    HallModule,
  ],
  providers: [BusinessPanelService, BusinessService, PagerRequestgGateway],
  controllers: [
    BusinessController,
    BusinessPanelController,
    EventPanelController,
    CustomersController,
    CustomersPanelController,
  ],
})
export class BusinessModule {}
