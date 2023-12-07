'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('business-category', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'businesses',
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
    return queryInterface.dropTable('business-category');
  },
};
