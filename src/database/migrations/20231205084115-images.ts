import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable('images', {
      uuid: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      imageable_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageable_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: null,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('images');
  },
};
