import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('business_user-role', 'role_uuid', {
      type: DataTypes.UUID,
      onDelete: 'Cascade',
      references: {
        model: 'roles',
        key: 'uuid',
      },
    });
    await queryInterface.changeColumn(
      'business_user-role',
      'business_user_uuid',
      {
        type: DataTypes.UUID,
        onDelete: 'Cascade',
        references: {
          model: 'business-user',
          key: 'uuid',
        },
      },
    );
  },

  async down() {},
};
