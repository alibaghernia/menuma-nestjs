import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('business_category-product', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_category_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'business-category',
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
    return queryInterface.dropTable('business_category-product');
  },
};
