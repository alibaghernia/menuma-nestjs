import {
  all_permissions,
  roles as accessControlRoles,
} from 'src/access_control/constants';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as UUIDv4 } from 'uuid';

const roles = Object.values(accessControlRoles);

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
