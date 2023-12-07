import { BelongsToManyHasAssociationMixin } from 'sequelize';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeRestaurant } from 'src/cafe_restaurant/entites/cafe_restaurant.entity';
import { CafeRestaurantUser } from 'src/cafe_restaurant/entites/cafe_restaurant_user.entity';

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

  @BelongsToMany(() => CafeRestaurant, {
    through: () => CafeRestaurantUser,
    as: 'cafeRestaurants',
    foreignKey: 'user_uuid',
    sourceKey: 'uuid',
    otherKey: 'cafe_restaurant_uuid',
    targetKey: 'uuid',
  })
  cafeRestaurants: CafeRestaurant[];

  hasCafeRestaurant: BelongsToManyHasAssociationMixin<
    CafeRestaurant,
    CafeRestaurant['uuid']
  >;
}
