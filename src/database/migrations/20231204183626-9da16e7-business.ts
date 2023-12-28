import { DataTypes } from 'sequelize';
import { Migration } from 'sequelize-cli';

const migration: Migration = {
  async up(queryInterface) {
    const tableName = 'businesses';
    const table = await queryInterface.describeTable(tableName);
    if (!table.pager) {
      return queryInterface.addColumn(tableName, 'pager', {
        type: DataTypes.BOOLEAN,
      });
    }
  },
  async down(queryInterface) {
    return queryInterface.dropTable('businesses');
  },
};

export default migration;
