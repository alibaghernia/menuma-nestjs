import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('business-user', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'businesses',
          key: 'uuid',
        },
      },
      user_uuid: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('business-user');
  },
};
