import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(
      'catalogs',
      {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        image: {
          type: DataTypes.UUID,
        },
        short_description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        long_description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        labels: {
          type: DataTypes.JSON,
        },
        soon: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
