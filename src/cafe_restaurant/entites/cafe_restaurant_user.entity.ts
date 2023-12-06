import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeRestaurant } from './cafe_restaurant.entity';
import { User } from 'src/users/entites/user.entity';

@Table({
  tableName: 'cafe_restaurant-user',
  timestamps: false,
})
export class CafeRestaurantUser extends Model<CafeRestaurantUser> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => CafeRestaurant)
  cafe_restaurant_uuid: string;

  @ForeignKey(() => User)
  user_uuid: string;

  @Column({
    type: DataType.ENUM('manager', 'employee'),
    defaultValue: 'employee',
    allowNull: false,
  })
  role: string;
}
