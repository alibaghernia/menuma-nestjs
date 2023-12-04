'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'users',
      {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUID,
        },
        first_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(50),
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        mobile: {
          type: DataTypes.STRING(13),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(50),
        },
        password: {
          type: DataTypes.STRING(110),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('admin', 'user', 'manager'),
          defaultValue: 'user',
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        hooks: {
          beforeCreate: function (model, options, fn) {
            model.createdAt = new Date();
            model.updatedAt = new Date();
            fn(null, model);
          },
          beforeUpdate: function (model, options, fn) {
            model.updatedAt = new Date();
            fn(null, model);
          },
        },
      },
    );
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('users');
  },
};
