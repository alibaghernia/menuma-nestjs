import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('events', 'short_description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('events', 'long_description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  async down() {},
};
