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

  hooks: {
    afterFind(model: any) {
      const task = (mo) => {
        mo.setImageUrl?.();
      };
      if (model?.length) model.forEach(task);
      else {
        task(model);
      }
    },
  },
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
  })
  image: string;
  setImageUrl() {
    const image = this.getDataValue('image');
    if (image) this.setDataValue('image_url', makeImageUrl(image));
    return this;
  }
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

  products_count?: number;
}
