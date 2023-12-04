const { config: dotenvConfig } = require('dotenv');

dotenvConfig({ path: '.env' });

const config = {
  development: {
    dialect: 'mariadb',
    host: `${process.env.DB_HOST}`,
    port: +`${process.env.DB_PORT}`,
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
  },
  production: {
    dialect: 'mariadb',
    host: `${process.env.DB_HOST}`,
    port: +`${process.env.DB_PORT}`,
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
  },
  test: {
    dialect: 'mariadb',
    host: `${process.env.DB_HOST}`,
    port: +`${process.env.DB_PORT}`,
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
  },
};

module.exports = config;
