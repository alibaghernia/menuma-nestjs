'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('business-tables', 'image', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async () => {},
};
