import { Module } from '@nestjs/common';
import { CafeReastaurantService } from './cafe_reastaurant.service';
import { CafeReastaurantController } from './cafe_reastaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CafeReastaurant } from './entites/cafe_reastaurant.entity';
import { Social } from 'src/database/entities/social.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([CafeReastaurant, Social]), UsersModule],
  providers: [CafeReastaurantService],
  controllers: [CafeReastaurantController],
})
export class CafeReastaurantModule {}
