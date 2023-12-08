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
import { Business } from 'src/business/entites/business.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryProduct } from './category_product.entity';
import {
  BelongsToSetAssociationMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { Tag } from 'src/database/entities/tag.entity';
import { BelongsToManySetAssociationsMixin } from 'sequelize';

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
  underscored: true,
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

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  business_uuid: string;

  @HasMany(() => Tag, {
    as: 'tags',
    foreignKey: 'tagable_uuid',
    sourceKey: 'uuid',
    scope: {
      tagable_type: 'product',
    },
  })
  tags: Tag[];

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;

  @BelongsToMany(() => Category, {
    through: () => CategoryProduct,
    foreignKey: 'product_uuid',
    sourceKey: 'uuid',
    otherKey: 'category_uuid',
    targetKey: 'uuid',
  })
  categories: Category[];

  setBusiness: BelongsToSetAssociationMixin<Business, Business['uuid']>;
  setCategories: BelongsToManySetAssociationsMixin<Category, Category['uuid']>;
  setTags: BelongsToManySetAssociationsMixin<Tag, Tag['uuid']>;
  createTag: HasManyCreateAssociationMixin<Tag>;
}
