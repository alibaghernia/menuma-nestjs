import { DataType } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'photographies',
      {
        uuid: {
          primaryKey: true,
          type: DataType.UUID,
          defaultValue: DataType.UUIDV4,
        },
        name: { allowNull: false, type: DataType.STRING(50) },
        cafe_name: { allowNull: false, type: DataType.STRING(50) },
        phone_number: { allowNull: false, type: DataType.STRING(24) },
        description: { allowNull: true, type: DataType.STRING(255) },
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
    return queryInterface.dropTable('photographies');
  },
};
