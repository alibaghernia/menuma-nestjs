import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('role-permission', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'roles',
          key: 'uuid',
        },
      },
      permission_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'permissions',
          key: 'uuid',
        },
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('role-permission');
  },
};
