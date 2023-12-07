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

type Metadata = {
  title: string;
  value: string;
};
type Price = {
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
  metadata: Metadata[];

  @Column({
    type: DataType.JSON,
  })
  prices: Price[];

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
}
