import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('business_user-role', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_user_uuid: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'business-user',
          key: 'uuid',
        },
      },
      role_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'roles',
          key: 'uuid',
        },
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('business_user-role');
  },
};
