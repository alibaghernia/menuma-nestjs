import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entites/user.entity';
import { CafeReastaurantUser } from './cafe_reastaurant_user.entity';
import { Social } from 'src/database/entities/social.entity';
import { CafeReastaurantCategory } from './cafe_reastaurant_category.entity';
import { Category } from 'src/category/entities/category.entity';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'cafe_reastaurants',
})
export class CafeReastaurant extends Model<CafeReastaurant> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING(50), unique: true })
  slug: string;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  status: boolean;

  @Column({ type: DataType.STRING(100) })
  address: string;

  @Column({ type: DataType.STRING(100) })
  description: string;

  @Column({ type: DataType.STRING(20) })
  location_lat: string;

  @Column({ type: DataType.STRING(20) })
  location_long: string;

  @Column({ type: DataType.STRING(20) })
  phone_number: string;

  @Column({ type: DataType.STRING(20) })
  email: string;

  @Column({ type: DataType.JSON })
  working_hours: object[];

  @Column({ type: DataType.STRING })
  logo: string;

  @Column({ type: DataType.STRING })
  banner: string;

  @BelongsToMany(() => User, {
    through: () => CafeReastaurantUser,
    as: 'users',
    otherKey: 'user_uuid',
    sourceKey: 'uuid',
    foreignKey: 'cafe_reastaurant_uuid',
    targetKey: 'uuid',
  })
  users: User[];

  @HasMany(() => Social, {
    as: 'socials',
    foreignKey: 'socialable_uuid',
    sourceKey: 'uuid',
    scope: {
      socialable_type: 'cafe_reastaurant',
    },
  })
  socials: Social[];

  @BelongsToMany(() => Category, {
    through: () => CafeReastaurantCategory,
    as: 'categories',
    foreignKey: 'cafe_reastaurant_uuid',
    sourceKey: 'uuid',
    otherKey: 'category_uuid',
    targetKey: 'uuid',
  })
  categories: Category[];
}
