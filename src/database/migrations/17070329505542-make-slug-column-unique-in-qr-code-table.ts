'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('qr-codes', 'slug', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    });
  },

  down: async () => {},
};
