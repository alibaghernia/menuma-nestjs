import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entites/user.entity';
import { CafeRestaurantUser } from './cafe_restaurant_user.entity';
import { Social } from 'src/database/entities/social.entity';
import { CafeRestaurantCategory } from './cafe_restaurant_category.entity';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
} from 'sequelize';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'cafe_restaurants',
  paranoid: true,
})
export class CafeRestaurant extends Model<CafeRestaurant> {
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
    through: () => CafeRestaurantUser,
    as: 'users',
    otherKey: 'user_uuid',
    sourceKey: 'uuid',
    foreignKey: 'cafe_restaurant_uuid',
    targetKey: 'uuid',
  })
  users: User[];

  @HasMany(() => Social, {
    as: 'socials',
    foreignKey: 'socialable_uuid',
    sourceKey: 'uuid',
    scope: {
      socialable_type: 'cafe_restaurant',
    },
  })
  socials: Social[];

  @BelongsToMany(() => Category, {
    through: () => CafeRestaurantCategory,
    as: 'categories',
    foreignKey: 'cafe_restaurant_uuid',
    sourceKey: 'uuid',
    otherKey: 'category_uuid',
    targetKey: 'uuid',
  })
  categories: Category[];

  @HasMany(() => Product, {
    as: 'products',
    foreignKey: 'cafe_restaurant_uuid',
    sourceKey: 'uuid',
  })
  products: Product[];

  count: HasManyCountAssociationsMixin;

  addUser: HasManyAddAssociationMixin<User, User['uuid']>;
  removeUser: HasManyRemoveAssociationMixin<User, User['uuid']>;
  hasUser: HasManyHasAssociationMixin<User, User['uuid']>;
  createUser: HasManyCreateAssociationMixin<User>;

  addProduct: HasManyAddAssociationMixin<Product, Product['uuid']>;
  removeProduct: HasManyRemoveAssociationMixin<Product, Product['uuid']>;
  hasProduct: HasManyHasAssociationMixin<Product, Product['uuid']>;
  createProduct: HasManyCreateAssociationMixin<Product>;
}
