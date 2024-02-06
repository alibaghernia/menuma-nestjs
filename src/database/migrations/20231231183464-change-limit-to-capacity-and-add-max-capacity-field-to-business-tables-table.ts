'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('business-tables', 'limit', 'capacity');
    await queryInterface.addColumn('business-tables', 'max_capacity', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  down: async () => {},
};
