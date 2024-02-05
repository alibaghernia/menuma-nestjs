'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('events', 'price', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: async () => {},
};
