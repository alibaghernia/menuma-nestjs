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
import { CafeReastaurant } from 'src/cafe_reastaurant/entites/cafe_reastaurant.entity';
import { CafeReastaurantCategory } from 'src/cafe_reastaurant/entites/cafe_reastaurant_category.entity';
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

  @BelongsToMany(() => CafeReastaurant, {
    through: () => CafeReastaurantCategory,
    as: 'cafeReastaurants',
    foreignKey: 'category_uuid',
    sourceKey: 'uuid',
    otherKey: 'cafe_reastaurant_uuid',
    targetKey: 'uuid',
  })
  cafeReastaurants: CafeReastaurant[];

  @BelongsToMany(() => Product, {
    through: () => CategoryProduct,
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    otherKey: 'product_uuid',
    targetKey: 'uuid',
  })
  products: Product[];
}
