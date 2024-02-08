'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('customers', 'business_uuid', {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'uuid',
      },
    });
  },

  down: async () => {},
};
