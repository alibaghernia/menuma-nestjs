import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeReastaurant } from 'src/cafe_reastaurant/entites/cafe_reastaurant.entity';
import { CafeReastaurantUser } from 'src/cafe_reastaurant/entites/cafe_reastaurant_user.entity';

@Table({
  timestamps: true,
  underscored: true,
})
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  firstName: string;

  @Column({ type: DataType.STRING(50) })
  lastName: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  username: string;

  @Column({ type: DataType.STRING(13) })
  mobile: string;

  @Column({ type: DataType.STRING(50) })
  email: string;

  @Column({ allowNull: false, type: DataType.STRING(110) })
  password: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM('admin', 'user', 'manager'),
    defaultValue: 'user',
  })
  role: string;

  @BelongsToMany(() => CafeReastaurant, {
    through: () => CafeReastaurantUser,
    as: 'cafe_reastaurants',
    foreignKey: 'user_uuid',
    sourceKey: 'uuid',
    otherKey: 'cafe_reastaurant_uuid',
    targetKey: 'uuid',
  })
  cafeCafeReastaurants: CafeReastaurant[];
}
