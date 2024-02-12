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
import {
  BelongsToSetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
} from 'sequelize';
import { Tag } from 'src/database/entities/tag.entity';
import { BelongsToManySetAssociationsMixin } from 'sequelize';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { BusinessCategoryProduct } from './business-category_product.entity';
import { HasManyAddAssociationsMixin } from 'sequelize';
import { FileProduct } from './file_product.entity';
import { File } from 'src/files/entities/file.entity';
import { makeImageUrl } from 'src/utils/images';

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
  paranoid: false,
  hooks: {
    afterFind(model: any) {
      const task = (mo) => {
        mo?.setImagesUrls?.();
      };
      if (model?.length) model.forEach(task);
      else {
        task(model);
      }
    },
  },
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
    allowNull: true,
  })
  metadata: string[];
  // metadata: ProductMetadata[];

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

  @BelongsToMany(() => BusinessCategory, {
    through: () => BusinessCategoryProduct,
    as: 'categories',
    foreignKey: 'product_uuid',
    sourceKey: 'uuid',
    otherKey: 'business_category_uuid',
    targetKey: 'uuid',
  })
  categories: BusinessCategory[];

  @BelongsToMany(() => File, {
    through: () => FileProduct,
    as: 'images',
    foreignKey: 'product_uuid',
    otherKey: 'file_uuid',
    sourceKey: 'uuid',
    targetKey: 'uuid',
  })
  images: File[];
  image?: string;
  image_url?: string;
  setImagesUrls() {
    const images = this.getDataValue('images');
    if (images?.length) {
      this.setDataValue('image', images[0].uuid);
      this.setDataValue('image_url', makeImageUrl(images[0].uuid));
      this.setDataValue('images', undefined);
    }
    return this;
  }
  setBusiness: BelongsToSetAssociationMixin<Business, Business['uuid']>;
  setCategories: BelongsToManySetAssociationsMixin<
    BusinessCategory,
    BusinessCategory['uuid']
  >;
  createTag: HasManyCreateAssociationMixin<Tag>;
  addTags: HasManyAddAssociationsMixin<Tag, Tag['uuid']>;
  addTag: HasManyAddAssociationMixin<Tag, Tag['uuid']>;
  hasTag: HasManyHasAssociationMixin<Tag, Tag['uuid']>;
  removeTag: HasManyRemoveAssociationMixin<Tag, Tag['uuid']>;
  removeTags: HasManyRemoveAssociationsMixin<Tag, Tag['uuid']>;

  setImages: BelongsToManySetAssociationsMixin<File, File['uuid']>;
}
