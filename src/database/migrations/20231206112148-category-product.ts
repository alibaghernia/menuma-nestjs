import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('category-product', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      category_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'categories',
          key: 'uuid',
        },
      },
      product_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'products',
          key: 'uuid',
        },
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('category-product');
  },
};
