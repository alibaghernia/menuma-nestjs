'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('users', [
      {
        uuid: '07ab5e75-3e92-4530-8d44-b085670aef15',
        username: 'admin',
        first_name: 'admin',
        password:
          '$2a$10$lIahHU2he8fQd3XrQ3TGwOdvLHU6LEXDE5NV.XuM9kOJWvfgughnW', //adminpass,
        mobile: '09000000000',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('users', [
      {
        username: 'admin',
      },
    ]);
  },
};
