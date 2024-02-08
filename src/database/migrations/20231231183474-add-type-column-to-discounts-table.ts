import { DataTypes, QueryInterface } from 'sequelize';
import { discountTypes } from 'src/discounts/dto';

export default {
  async up(queryInterface: QueryInterface) {
    return queryInterface.addColumn('discounts', 'type', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: discountTypes.NORMAL,
    });
  },

  async down() {},
};
