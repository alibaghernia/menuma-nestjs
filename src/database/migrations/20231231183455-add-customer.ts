import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.createTable(
      'customers',
      {
        uuid: {
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        name: { type: DataTypes.STRING(100), allowNull: false },
        sur_name: { type: DataTypes.STRING(100), allowNull: false },
        birthday: { type: DataTypes.STRING(100), allowNull: false },
        gender: { type: DataTypes.STRING(100), allowNull: false },
        mobile: { type: DataTypes.STRING(100), allowNull: false },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
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
    return queryInterface.dropTable('customers');
  },
};
