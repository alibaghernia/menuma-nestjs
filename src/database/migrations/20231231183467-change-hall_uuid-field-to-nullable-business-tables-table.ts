'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('business-tables', 'hall_uuid', {
      type: DataTypes.UUID,
      allowNull: true,
    });
  },

  down: async () => {},
};
