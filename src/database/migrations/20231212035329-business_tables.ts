import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'business-tables',
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
        code: {
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
    return queryInterface.dropTable('business-tables');
  },
};
