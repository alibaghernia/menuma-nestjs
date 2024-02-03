import { Business_Employee_role } from 'src/access_control/constants';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as UUIDv4 } from 'uuid';

const roles = [Business_Employee_role];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.removeConstraint('roles', 'roles_ibfk_1');
    } catch (error) {
      console.log('constraints remove error!');
    }
    try {
      await queryInterface.removeConstraint(
        'role-permission',
        'role-permission_ibfk_1',
      );
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

  async down(queryInterface) {},
};
