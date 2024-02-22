import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('businesses', 'address', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  async down() {},
};
