import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeRestaurant } from 'src/cafe_restaurant/entites/cafe_restaurant.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryProduct } from './category_product.entity';
import { BelongsToSetAssociationMixin } from 'sequelize';

export type ProductMetadata = {
  title: string;
  value: string;
};
export type ProductPrice = {
  title: string;
  amount: number;
};

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model<Product> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.JSON,
  })
  metadata: ProductMetadata[];

  @Column({
    type: DataType.JSON,
  })
  prices: ProductPrice[];

  @ForeignKey(() => CafeRestaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  cafe_restaurant_uuid: string;

  @BelongsTo(() => CafeRestaurant, {
    as: 'cafeRestaurant',
    foreignKey: 'cafe_restaurant_uuid',
    targetKey: 'uuid',
  })
  cafeRestaurant: CafeRestaurant;

  @BelongsToMany(() => Category, {
    through: () => CategoryProduct,
    foreignKey: 'product_uuid',
    sourceKey: 'uuid',
    otherKey: 'category_id',
    targetKey: 'uuid',
  })
  categories: Category[];

  setCafeRestaurant: BelongsToSetAssociationMixin<
    CafeRestaurant,
    CafeRestaurant['uuid']
  >;
}
