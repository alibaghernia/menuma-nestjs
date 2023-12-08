import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'users',
      {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        first_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(50),
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        mobile: {
          type: DataTypes.STRING(13),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(50),
        },
        password: {
          type: DataTypes.STRING(110),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('admin', 'user', 'manager'),
          defaultValue: 'user',
        },

        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        hooks: {
          beforeCreate: function (model, options, fn) {
            model.created_at = new Date();
            model.updated_at = new Date();
            fn(null, model);
          },
          beforeUpdate: function (model, options, fn) {
            model.updated_at = new Date();
            fn(null, model);
          },
        },
      },
    );
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('users');
  },
};
