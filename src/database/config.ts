import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: SequelizeModuleOptions = {
  dialect: 'mariadb',
  host: `${process.env.DB_HOST}`,
  port: +`${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  autoLoadModels: true,
  logging: false,
};

export default registerAs('sequelize', () => config);
