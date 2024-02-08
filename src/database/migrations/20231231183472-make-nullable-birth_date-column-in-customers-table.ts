'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('customers', 'birth_date', {
      type: DataTypes.STRING(100),
      allowNull: true,
    });
  },

  down: async () => {},
};
