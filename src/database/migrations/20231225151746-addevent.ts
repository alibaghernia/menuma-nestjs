import { DataTypes } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'events',
      {
        uuid: {
          primaryKey: true,
          type: DataType.UUID,
          defaultValue: DataType.UUIDV4,
        },
        name: { type: DataType.STRING(100), allowNull: false },
        start_at: { type: DataType.STRING(100), allowNull: false },
        end_at: { type: DataType.STRING(100) },
        limit: { type: DataType.INTEGER() },
        banner_id: { type: DataType.UUID },
        short_description: { type: DataType.STRING(100) },
        long_description: { type: DataType.STRING(100) },
        organizer_type: { type: DataType.STRING(100), allowNull: false },
        organizer_uuid: { type: DataType.UUID, allowNull: false },
        cycle: { type: DataType.STRING(100), allowNull: false },
        price: { type: DataType.STRING(100), allowNull: false },
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
    return queryInterface.dropTable('events');
  },
};
