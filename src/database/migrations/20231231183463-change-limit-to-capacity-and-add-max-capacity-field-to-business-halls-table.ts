'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('business-halls', 'limit', 'capacity');
    await queryInterface.addColumn('business-halls', 'max_capacity', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('business-halls', 'image', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async () => {},
};
