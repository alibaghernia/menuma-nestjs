import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('file-product', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      file_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'files',
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
    return queryInterface.dropTable('file-product');
  },
};
