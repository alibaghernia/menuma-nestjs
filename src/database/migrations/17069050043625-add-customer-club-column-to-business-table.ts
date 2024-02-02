import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.addColumn('businesses', 'customer_club', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    });
  },

  async down() {},
};
