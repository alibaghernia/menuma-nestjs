'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('customers', 'mobile', {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    });
  },

  down: async () => {},
};
