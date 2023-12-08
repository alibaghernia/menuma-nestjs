const { v4: UUIDv4 } = require('uuid');

('use strict');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const business_permissions = [
      {
        title: 'Create Business',
        action: 'create-business',
      },
      {
        title: 'Update Business Info',
        action: 'update-business-info',
      },
      {
        title: 'Remove Business',
        action: 'remove-business',
      },
      {
        title: 'See All Business',
        action: 'see-all-business',
      },
      {
        title: 'Add User to Business',
        action: 'add-user-to-business',
      },
      {
        title: 'Remove User from Business',
        action: 'remove-user-from-business',
      },
    ];
    const product_permissions = [
      {
        title: 'Create new product',
        action: 'create-product',
      },
      {
        title: 'Update product',
        action: 'update-product',
      },
      {
        title: 'Delete product',
        action: 'delete-product',
      },
    ];
    const category_permissions = [
      {
        title: 'Create new category',
        action: 'create-category',
      },
      {
        title: 'Update category',
        action: 'update-category',
      },
      {
        title: 'Delete category',
        action: 'delete-category',
      },
    ];

    const all_permissions = business_permissions
      .concat(product_permissions, category_permissions)
      .map((item) => {
        item.uuid = UUIDv4();
      });

    console.log({
      all_permissions,
    });
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
