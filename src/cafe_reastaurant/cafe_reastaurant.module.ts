import { Module } from '@nestjs/common';
import { CafeReastaurantService } from './cafe_reastaurant.service';
import { CafeReastaurantController } from './cafe_reastaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CafeReastaurant } from './entites/cafe_reastaurant.entity';
import { Social } from 'src/database/entities/social.entity';

@Module({
  imports: [SequelizeModule.forFeature([CafeReastaurant, Social])],
  providers: [CafeReastaurantService],
  controllers: [CafeReastaurantController],
})
export class CafeReastaurantModule {}
