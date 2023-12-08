'use strict';
/* eslint-disable @typescript-eslint/no-unused-vars */
const { v4: UUIDv4 } = require('uuid');

const business_permissions = [
  {
    uuid: '3cd1e431-2e4b-4150-aa0c-d01d9e16fbd0',
    title: 'Create Business',
    action: 'create-business',
  },
  {
    uuid: '6ccd3769-75e3-4a4e-8abb-a03a7121df90',
    title: 'Update Business Info',
    action: 'update-business-info',
  },
  {
    uuid: 'dc2ce74f-eea0-462c-a339-c6c325a8c2ec',
    title: 'Remove Business',
    action: 'remove-business',
  },
  {
    uuid: '9638edcc-617a-4767-bee5-8a4886d58611',
    title: 'See All Business',
    action: 'see-all-business',
  },
  {
    uuid: '49c328f1-0d47-483f-b646-f52cf30599eb',
    title: 'Add User to Business',
    action: 'add-user-to-business',
  },
  {
    uuid: 'c6419246-e9eb-44bf-b140-717916182822',
    title: 'Remove User from Business',
    action: 'remove-user-from-business',
  },
];
const product_permissions = [
  {
    uuid: 'fe81d8f7-9b4c-45de-b489-e0a515a6a801',
    title: 'Create new product',
    action: 'create-product',
  },
  {
    uuid: '0bd70c1c-605c-4702-9122-7d17923f902c',
    title: 'Update product',
    action: 'update-product',
  },
  {
    uuid: '5700489a-c7d6-4cfc-882e-7e5066bb817d',
    title: 'Delete product',
    action: 'delete-product',
  },
];
const category_permissions = [
  {
    uuid: 'fceed642-bf28-4cea-9cb6-39040748a031',
    title: 'Create new category',
    action: 'create-category',
  },
  {
    uuid: '702e0d99-7697-4602-ac64-0e2d705e465a',
    title: 'Update category',
    action: 'update-category',
  },
  {
    uuid: '4d4d49f0-2439-44d9-9c05-4004a047062b',
    title: 'Delete category',
    action: 'delete-category',
  },
];

const all_permissions = business_permissions.concat(
  product_permissions,
  category_permissions,
);

const roles = [
  {
    uuid: 'cf0b5bfe-cbaa-4a0c-aad5-ff2cb7faf94b',
    business_uuid: '',
    title: 'Administrator',
    permissions: all_permissions.map((item) => item.uuid),
  },
  {
    uuid: 'fcf1f8e3-8dba-4e70-97d9-3fd14b812af0',
    business_uuid: '',
    title: 'Business Manager',
    permissions: all_permissions
      .filter((item) =>
        [
          '3cd1e431-2e4b-4150-aa0c-d01d9e16fbd0',
          '6dc2ce74f-eea0-462c-a339-c6c325a8c2ec',
          '9638edcc-617a-4767-bee5-8a4886d58611',
        ].includes(item.uuid),
      )
      .map((item) => item.uuid),
  },
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('permissions', all_permissions);
    try {
      await queryInterface.removeConstraint('roles', 'roles_ibfk_1');
    } catch (error) {
      console.log('constraints remove error!');
    }
    await queryInterface.bulkInsert(
      'roles',
      roles.map(({ permissions, ...item }) => item),
    );

    for (const role of roles) {
      await queryInterface.bulkInsert(
        'role-permission',
        role.permissions.map((permission) => ({
          uuid: UUIDv4(),
          role_uuid: role.uuid,
          permission_uuid: permission,
        })),
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role-permission', {
      uuid: '*',
    });
    await queryInterface.bulkDelete(
      'permissions',
      all_permissions.map((item) => ({
        uuid: item.uuid,
      })),
    );
    await queryInterface.bulkDelete(
      'roles',
      roles.map((item) => ({
        uuid: item.uuid,
      })),
    );
  },
};
