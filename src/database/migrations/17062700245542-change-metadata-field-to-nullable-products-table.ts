'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('businesses', 'metdata', {
      type: DataTypes.JSON,
      allowNull: true,
    });
  },

  down: async () => {},
};
