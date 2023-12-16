import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('business-category', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_uuid: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'businesses',
          key: 'uuid',
        },
      },
      category_uuid: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'categories',
          key: 'uuid',
        },
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
    return queryInterface.dropTable('business-category');
  },
};
