import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/category/entities/category.entity';
import { Product } from './product.entity';

@Table({
  tableName: 'category-product',
  timestamps: false,
})
export class CategoryProduct extends Model<CategoryProduct> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => Category)
  category_uuid: string;

  @ForeignKey(() => Product)
  product_uuid: string;
}
