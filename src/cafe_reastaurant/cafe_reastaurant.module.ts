import { Module } from '@nestjs/common';
import { CafeReastaurantService } from './cafe_reastaurant.service';
import { CafeReastaurantController } from './cafe_reastaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CafeReastaurant } from './entites/cafe_reastaurant.entity';

@Module({
  imports: [SequelizeModule.forFeature([CafeReastaurant])],
  providers: [CafeReastaurantService],
  controllers: [CafeReastaurantController],
})
export class CafeReastaurantModule {}
