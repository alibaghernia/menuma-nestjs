'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const permissions = [
      {
        uuid: '9eeede7a-792b-40bb-9faf-d174345413d9',
        title: 'Create Business',
        action: 'create-business',
      },
      {
        uuid: '964e84f8-cc43-4bc2-b9bc-f5dc384fe6e5',
        title: 'Update Business Info',
        action: 'update-business-info',
      },
      {
        uuid: '2e83ad0b-6154-42e7-b45d-0e717b134785',
        title: 'Add User to Business',
        action: 'add-user-to-business',
      },
      {
        uuid: '88d335ae-7c3d-4557-9277-a23c880b209e',
        title: 'Add User to Business',
        action: 'add-user-to-business',
      },
    ];
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
