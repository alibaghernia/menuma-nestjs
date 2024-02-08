'use strict';

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('customers', 'created_at', 'createdAt');
    await queryInterface.renameColumn('customers', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('customers', 'deleted_at', 'deletedAt');
  },

  down: async () => {},
};
