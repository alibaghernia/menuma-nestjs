import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from './business.entity';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { BusinessCategoryProduct } from 'src/product/entities/business-category_product.entity';
import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';

@Table({
  tableName: 'business-category',
  timestamps: false,
})
export class BusinessCategory extends Model<BusinessCategory> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
  })
  business_uuid: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_uuid: string;

  @BelongsTo(() => Category, {
    as: 'cateogry',
    foreignKey: 'category_uuid',
    targetKey: 'uuid',
  })
  category: Category;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;

  @BelongsToMany(() => Product, {
    through: () => BusinessCategoryProduct,
    as: 'products',
    foreignKey: 'business_category_uuid',
    sourceKey: 'uuid',
    otherKey: 'product_uuid',
    targetKey: 'uuid',
  })
  products: Product[];

  getBusiness: BelongsToGetAssociationMixin<Business>;
  getCategory: BelongsToGetAssociationMixin<Category>;
  createCategory: BelongsToCreateAssociationMixin<Category>;
}
