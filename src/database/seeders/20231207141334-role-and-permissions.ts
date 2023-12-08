import {
  access_control,
  business_permissions,
  category_permissions,
  product_permissions,
} from 'src/access_control/constants';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as UUIDv4 } from 'uuid';

const all_permissions = Object.values(business_permissions).concat(
  Object.values(access_control),
  Object.values(product_permissions),
  Object.values(category_permissions),
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
          'see-all-roles',
          'update-system-role',
          'create-business',
          'remove-business',
          'see-all-business',
        ].includes(item.action),
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
    const permissionsUUID = all_permissions.map((item) => ({
      uuid: item.uuid,
    }));
    for (const deleteItem of permissionsUUID.map((item) => ({
      permission_uuid: item.uuid,
    }))) {
      const res1 = await queryInterface.bulkDelete('role-permission', [
        deleteItem,
      ]);
    }

    for (const deleteItem of permissionsUUID) {
      const res1 = await queryInterface.bulkDelete('permissions', [deleteItem]);
    }
    for (const deleteItem of roles.map((item) => ({
      uuid: item.uuid,
    }))) {
      const res1 = await queryInterface.bulkDelete('roles', [deleteItem]);
    }
  },
};
