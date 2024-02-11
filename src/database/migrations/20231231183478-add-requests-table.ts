import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(
      'requests',
      {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        //@ts-ignore
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
    await queryInterface.dropTable('catalogs');
  },
};
