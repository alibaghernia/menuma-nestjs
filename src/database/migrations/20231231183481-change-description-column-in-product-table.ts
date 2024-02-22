import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('products', 'description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  async down() {},
};
