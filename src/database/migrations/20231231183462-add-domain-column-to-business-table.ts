import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.addColumn('businesses', 'domain', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down() {},
};
