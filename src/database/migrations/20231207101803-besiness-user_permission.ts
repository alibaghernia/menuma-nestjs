import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.createTable('business_user-permission', {
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
    return queryInterface.dropTable('business_user-permission');
  },
};
