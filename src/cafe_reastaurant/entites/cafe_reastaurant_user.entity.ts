import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeReastaurant } from './cafe_reastaurant.entity';
import { User } from 'src/users/entites/user.entity';

@Table({
  tableName: 'cafe_reastaurant-user',
  timestamps: false,
})
export class CafeReastaurantUser extends Model<CafeReastaurantUser> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => CafeReastaurant)
  cafe_reastaurant_uuid: string;

  @ForeignKey(() => User)
  user_uuid: string;
}
