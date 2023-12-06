import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeRestaurant } from 'src/cafe_restaurant/entites/cafe_restaurant.entity';
import { CafeRestaurantCategory } from 'src/cafe_restaurant/entites/cafe_restaurant_category.entity';
import { CategoryProduct } from 'src/product/entities/category_product.entity';
import { Product } from 'src/product/entities/product.entity';

@Table({
  tableName: 'categories',
  timestamps: false,
})
export class Category extends Model<Category> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  parent_uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  slug: string;

  @HasMany(() => Category, {
    as: 'childs',
    foreignKey: 'parent_uuid',
    sourceKey: 'uuid',
  })
  childs: Category[];

  @BelongsTo(() => Category, {
    foreignKey: 'parent_uuid',
    as: 'parent',
    targetKey: 'uuid',
  })
  parent: Category;

  @BelongsToMany(() => CafeRestaurant, {
    through: () => CafeRestaurantCategory,
    as: 'cafeRestaurants',
    foreignKey: 'category_uuid',
    sourceKey: 'uuid',
    otherKey: 'cafe_restaurant_uuid',
    targetKey: 'uuid',
  })
  cafeRestaurants: CafeRestaurant[];

  @BelongsToMany(() => Product, {
    through: () => CategoryProduct,
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    otherKey: 'product_uuid',
    targetKey: 'uuid',
  })
  products: Product[];
}
