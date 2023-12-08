import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'businesses',
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(100),
        },
        description: {
          type: DataTypes.STRING(100),
        },
        location_lat: {
          type: DataTypes.STRING(20),
        },
        location_long: {
          type: DataTypes.STRING(20),
        },
        phone_number: {
          type: DataTypes.STRING(20),
        },
        email: {
          type: DataTypes.STRING(20),
        },
        working_hours: {
          type: DataTypes.JSON,
        },
        logo: {
          type: DataTypes.STRING,
        },
        banner: {
          type: DataTypes.STRING,
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
    return queryInterface.dropTable('businesses');
  },
};
