import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('businesses', 'customer_club_enabled', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down() {},
};
