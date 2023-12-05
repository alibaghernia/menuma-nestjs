'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('cafe_reastaurant-category', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cafe_reastaurant_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'cafe_reastaurants',
          key: 'uuid',
        },
      },
      category_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'categories',
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
    return queryInterface.dropTable('cafe_reastaurant-category');
  },
};
