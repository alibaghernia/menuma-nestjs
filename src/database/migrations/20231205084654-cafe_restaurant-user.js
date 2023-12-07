'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('cafe_restaurant-user', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cafe_restaurant_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'cafe_restaurants',
          key: 'uuid',
        },
      },
      user_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        },
      },
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('cafe_restaurant-user');
  },
};
