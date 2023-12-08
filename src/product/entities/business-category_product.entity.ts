import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Product } from './product.entity';

@Table({
  tableName: 'business-category_product',
  underscored: true,
  timestamps: false,
})
export class BusinessCategoryProduct extends Model<BusinessCategoryProduct> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => BusinessCategory)
  business_category_uuid: string;

  @ForeignKey(() => Product)
  product_uuid: string;

  @BelongsTo(() => BusinessCategory, {
    as: 'businessCategory',
    foreignKey: 'business_category_uuid',
    targetKey: 'uuid',
  })
  businessCategory: BusinessCategory;

  @BelongsTo(() => Product, {
    as: 'product',
    foreignKey: 'product_uuid',
    targetKey: 'uuid',
  })
  product: Product;
}
