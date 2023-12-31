import { DataTypes } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'business-halls',
      {
        uuid: {
          primaryKey: true,
          type: DataType.UUID,
          defaultValue: DataType.UUIDV4,
        },
        business_uuid: {
          type: DataType.UUID,
          allowNull: false,
        },
        code: {
          type: DataType.STRING,
          allowNull: false,
        },
        limit: {
          type: DataType.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataType.STRING,
          allowNull: true,
        },

        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
      },
      {
        hooks: {
          beforeCreate: function (model, options, fn) {
            model.created_at = new Date();
            model.updated_at = new Date();
            fn(null, model);
          },
          beforeUpdate: function (model, options, fn) {
            model.updated_at = new Date();
            fn(null, model);
          },
        },
      },
    );
  },

  async down(queryInterface) {
    return queryInterface.dropTable('business-halls');
  },
};
