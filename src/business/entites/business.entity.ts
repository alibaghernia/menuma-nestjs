import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entites/user.entity';
import { BusinessUser } from './business_user.entity';
import { Social } from 'src/database/entities/social.entity';
import { BusinessCategory } from './business_category.entity';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyRemoveAssociationMixin,
  WhereOptions,
} from 'sequelize';
import { Role } from 'src/access_control/entities/role.entity';
import { QrCode } from 'src/qr-code/enitites/qr-code.entity';
import { BusinessTable } from './business_tables.entity';
import { PagerRequest } from './pager_request.entity';
import { BusinessHall } from './business_hall.entity';
import { makeImageUrl } from 'src/utils/images';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'businesses',
  paranoid: true,
})
export class Business extends Model<Business> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING(50), unique: true })
  slug: string;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  status: boolean;

  @Column({ type: DataType.STRING(100) })
  address: string;

  @Column({ type: DataType.STRING(100) })
  description: string;

  @Column({ type: DataType.STRING(20) })
  location_lat: string;

  @Column({ type: DataType.STRING(20) })
  location_long: string;

  @Column({ type: DataType.STRING(20) })
  phone_number: string;

  @Column({ type: DataType.STRING(20) })
  email: string;

  @Column({ type: DataType.JSON })
  working_hours: unknown[];

  @Column({
    type: DataType.STRING,
    get(this: Business) {
      const logo = this.getDataValue('logo');
      if (logo) this.setDataValue('logo_url', makeImageUrl(logo));
      return logo;
    },
  })
  logo: string;

  logo_url: string;

  @Column({
    type: DataType.STRING,
    get(this: Business) {
      const banner = this.getDataValue('banner');
      if (banner) this.setDataValue('banner_url', makeImageUrl(banner));
      return banner;
    },
  })
  banner: string;
  banner_url: string;

  @Column({ type: DataType.BOOLEAN })
  pager: boolean;

  @Column({ type: DataType.BOOLEAN })
  customer_club: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  domain?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  public: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  pin: boolean;

  @BelongsToMany(() => User, {
    through: () => BusinessUser,
    as: 'users',
    otherKey: 'user_uuid',
    sourceKey: 'uuid',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  users: User[];

  @HasMany(() => Social, {
    as: 'socials',
    foreignKey: 'socialable_uuid',
    sourceKey: 'uuid',
    scope: {
      socialable_type: 'business',
    },
  })
  socials: Social[];

  @BelongsToMany(() => Category, {
    through: () => BusinessCategory,
    as: 'categories',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
    otherKey: 'category_uuid',
    targetKey: 'uuid',
  })
  categories: Category[];

  @HasMany(() => Product, {
    as: 'products',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  products: Product[];

  @HasMany(() => BusinessUser, {
    as: 'businessUsers',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  businessUsers: BusinessUser[];

  @HasMany(() => Role, {
    as: 'roles',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  roles: string;

  @HasMany(() => QrCode, {
    as: 'qrCodes',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  qrCodes: QrCode;

  @HasMany(() => BusinessTable, {
    as: 'tables',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  tables: BusinessTable[];

  @HasMany(() => BusinessHall, {
    as: 'halls',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  halls: BusinessHall[];

  @HasMany(() => PagerRequest, {
    as: 'pagerRequests',
    foreignKey: 'business_uuid',
    sourceKey: 'uuid',
  })
  pagerRequests: PagerRequest[];

  count: HasManyCountAssociationsMixin;

  addUser: HasManyAddAssociationMixin<User, User['uuid']>;
  setUsers: BelongsToManySetAssociationsMixin<User, User['uuid']>;
  removeUser: HasManyRemoveAssociationMixin<User, User['uuid']>;
  hasUser: HasManyHasAssociationMixin<User, User['uuid']>;
  createUser: HasManyCreateAssociationMixin<User>;

  addProduct: HasManyAddAssociationMixin<Product, Product['uuid']>;
  removeProduct: HasManyRemoveAssociationMixin<Product, Product['uuid']>;
  hasProduct: HasManyHasAssociationMixin<Product, Product['uuid']>;
  createProduct: HasManyCreateAssociationMixin<Product>;

  createCategory: BelongsToManyCreateAssociationMixin<Category>;
  removeCategory: BelongsToManyRemoveAssociationMixin<
    Category,
    Category['uuid']
  >;
  addCategory: BelongsToManyAddAssociationMixin<Category, Category['uuid']>;
  hasCategory: BelongsToManyHasAssociationMixin<Category, Category['uuid']>;
  hasCategories: BelongsToManyHasAssociationsMixin<Category, Category['uuid']>;
  BusinessUser: BusinessUser;

  addSocial: HasManyAddAssociationMixin<Social, Social['uuid']>;
  createSocial: HasManyCreateAssociationMixin<Social>;

  async hasTable(where: WhereOptions<BusinessTable>) {
    const table = await BusinessTable.count({
      where: {
        business_uuid: this.uuid,
        ...where,
      },
    });
    return !!table;
  }
  async hasHall(where: WhereOptions<BusinessTable>) {
    const hall = await BusinessHall.count({
      where: {
        business_uuid: this.uuid,
        ...where,
      },
    });
    return !!hall;
  }
  createTable: HasManyCreateAssociationMixin<BusinessTable>;
  removeTable: HasManyRemoveAssociationMixin<
    BusinessTable,
    BusinessTable['uuid']
  >;
}
