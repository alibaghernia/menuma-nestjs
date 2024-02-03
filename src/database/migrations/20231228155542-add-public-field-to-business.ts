'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('businesses', 'public', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Set the default value if needed
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('businesses', 'public');
  },
};
