import { DataTypes } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'customers',
      {
        uuid: {
          primaryKey: true,
          type: DataType.UUID,
          defaultValue: DataType.UUIDV4,
        },
        name: { type: DataType.STRING(100), allowNull: false },
        sur_name: { type: DataType.STRING(100), allowNull: false },
        birthday: { type: DataType.STRING(100), allowNull: false },
        gender: { type: DataType.STRING(100), allowNull: false },
        mobile: { type: DataType.STRING(100), allowNull: false },
        business_uuid: {
          type: DataType.UUID,
          allowNull: false,
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
    return queryInterface.dropTable('customers');
  },
};
