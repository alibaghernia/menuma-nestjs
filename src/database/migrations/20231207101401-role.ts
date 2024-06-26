import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('roles', {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      deleted_at: DataTypes.DATE,
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('roles');
  },
};
