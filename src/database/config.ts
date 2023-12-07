import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config as dotenvConfig } from 'dotenv';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { Social } from './entities/social.entity';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { CategoryProduct } from 'src/product/entities/category_product.entity';
import { User } from 'src/users/entites/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Business } from 'src/business/entites/business.entity';
import { Product } from 'src/product/entities/product.entity';

dotenvConfig({ path: '.env' });

const config: SequelizeModuleOptions = {
  dialect: 'mariadb',
  host: `${process.env.DB_HOST}`,
  port: +`${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  logging: (process.env.ORM_LOGGING || 'true') == 'true',
  models: [
    User,
    Category,
    Business,
    Product,
    BusinessUser,
    BusinessCategory,
    CategoryProduct,
    Social,
  ],
};

export default registerAs('sequelize', () => config);
