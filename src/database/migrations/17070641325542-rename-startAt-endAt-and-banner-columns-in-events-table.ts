'use strict';

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('events', 'banner_id', 'banner_uuid');
  },

  down: async () => {},
};
