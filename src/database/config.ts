import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config as dotenvConfig } from 'dotenv';
import { CafeReastaurantUser } from 'src/cafe_reastaurant/entites/cafe_reastaurant_user.entity';
import { Social } from './entities/social.entity';
import { CafeReastaurantCategory } from 'src/cafe_reastaurant/entites/cafe_reastaurant_category.entity';
import { CategoryProduct } from 'src/product/entities/category_product.entity';
import { User } from 'src/users/entites/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { CafeReastaurant } from 'src/cafe_reastaurant/entites/cafe_reastaurant.entity';
import { Product } from 'src/product/entities/product.entity';

dotenvConfig({ path: '.env' });

const config: SequelizeModuleOptions = {
  dialect: 'mariadb',
  host: `${process.env.DB_HOST}`,
  port: +`${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  models: [
    User,
    Category,
    CafeReastaurant,
    Product,
    CafeReastaurantUser,
    CafeReastaurantCategory,
    CategoryProduct,
    Social,
  ],
};

export default registerAs('sequelize', () => config);
