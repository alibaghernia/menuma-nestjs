import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.createTable('file-product', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      file_uuid: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'files',
          key: 'uuid',
        },
      },
      product_uuid: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
