import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeReastaurant } from 'src/cafe_reastaurant/entites/cafe_reastaurant.entity';
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

  @ForeignKey(() => CafeReastaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  cafe_reastaurant_uuid: string;

  @BelongsTo(() => CafeReastaurant, {
    as: 'cafeReastaurant',
    foreignKey: 'cafe_reastaurant_uuid',
    targetKey: 'uuid',
  })
  cafeReastaurant: CafeReastaurant;

  @BelongsToMany(() => Category, {
    through: () => CategoryProduct,
    foreignKey: 'product_uuid',
    sourceKey: 'uuid',
    otherKey: 'category_id',
    targetKey: 'uuid',
  })
  categories: Category[];
}
