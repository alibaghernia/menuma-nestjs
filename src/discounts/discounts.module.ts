import { Module } from '@nestjs/common';
import { DiscountsService } from './services/discounts.service';
import { DiscountsPanelService } from './services/discounts.panel.service';
import { DiscountsController } from './controllers/discounts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Discount } from './entities/discount.entity';
import { Business } from 'src/business/entites/business.entity';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { DiscountsPanelController } from './controllers/discounts.panel.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Business, BusinessUser, Discount]),
    AccessControlModule,
  ],
  providers: [DiscountsService, DiscountsPanelService],
  controllers: [DiscountsController, DiscountsPanelController],
  exports: [DiscountsPanelService, DiscountsService],
})
export class DiscountsModule {}
