import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('events', 'short_description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('events', 'long_description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  async down() {},
};
