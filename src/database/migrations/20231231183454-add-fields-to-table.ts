'use strict';

import { DataTypes } from 'sequelize';
import { DataType } from 'sequelize-typescript';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('business-tables', 'hall_uuid', {
      type: DataTypes.UUID,
      reference: {
        // model: 'businesses',
        key: 'uuid',
      },
    });
    await queryInterface.addColumn('business-tables', 'description', {
      type: DataType.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('business-tables', 'limit', {
      type: DataType.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('business-tables', 'hall_uuid');
    await queryInterface.removeColumn('business-tables', 'description');
    await queryInterface.removeColumn('business-tables', 'limit');
  },
};
