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
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { makeImageUrl } from 'src/utils/images';

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

  @Column({
    type: DataType.STRING,
    get(this: Category) {
      const image = this.getDataValue('image');
      if (image) this.setDataValue('image_url', makeImageUrl(image));
      return image;
    },
  })
  image: string;
  image_url: string;

  @HasMany(() => Category, {
    as: 'childs',
    foreignKey: 'parent_uuid',
    sourceKey: 'uuid',
  })
  childs: Category[];

  @HasMany(() => BusinessCategory, {
    as: 'businessCategories',
    foreignKey: 'category_uuid',
    sourceKey: 'uuid',
  })
  businessCategories: BusinessCategory[];

  @BelongsTo(() => Category, {
    foreignKey: 'parent_uuid',
    as: 'parent',
    targetKey: 'uuid',
  })
  parent: Category;

  @BelongsToMany(() => Business, {
    through: () => BusinessCategory,
    as: 'businesses',
    foreignKey: 'category_uuid',
    sourceKey: 'uuid',
    otherKey: 'business_uuid',
    targetKey: 'uuid',
  })
  businesses: Business[];
}
