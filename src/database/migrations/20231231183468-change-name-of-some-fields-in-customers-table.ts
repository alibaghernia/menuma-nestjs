'use strict';

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('customers', 'name', 'first_name');
    await queryInterface.renameColumn('customers', 'surName', 'last_name');
    await queryInterface.renameColumn('customers', 'birthday', 'birth_date');
  },

  down: async () => {},
};
