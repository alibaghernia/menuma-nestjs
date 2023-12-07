'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('business_user-permission', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_user_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'business-user',
          key: 'uuid',
        },
      },
      permission_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'permissions',
          key: 'uuid',
        },
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('business_user-permission');
  },
};
