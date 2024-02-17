import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('customers', 'description', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down() {},
};
