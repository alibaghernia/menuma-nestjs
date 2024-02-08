import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface) {
    return queryInterface.createTable(
      'discounts',
      {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        business_uuid: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'businesses',
            key: 'uuid',
          },
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        discount: {
          type: DataTypes.INTEGER({ length: 3 }),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        pin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
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
    return queryInterface.dropTable('discounts');
  },
};
