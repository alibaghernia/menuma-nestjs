import { Module } from '@nestjs/common';
import { CafeRestaurantService } from './cafe_restaurant.service';
import { CafeRestaurantController } from './cafe_restaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CafeRestaurant } from './entites/cafe_restaurant.entity';
import { Social } from 'src/database/entities/social.entity';
import { User } from 'src/users/entites/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([CafeRestaurant, Social, User])],
  providers: [CafeRestaurantService],
  controllers: [CafeRestaurantController],
})
export class CafeRestaurantModule {}
