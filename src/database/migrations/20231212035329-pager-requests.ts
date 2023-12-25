import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'pager-requests',
      {
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
        table_uuid: {
          type: DataTypes.UUID,
          references: {
            model: 'business-tables',
            key: 'uuid',
          },
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
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
    return queryInterface.dropTable('pager-requests');
  },
};
