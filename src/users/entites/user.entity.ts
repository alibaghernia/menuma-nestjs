import {
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManySetAssociationsMixin,
} from 'sequelize';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from 'src/business/entites/business.entity';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { Event } from 'src/event/entities/event.entity';

@Table({
  timestamps: true,
  underscored: true,
})
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  first_name: string;

  @Column({ type: DataType.STRING(50) })
  last_name: string;

  @Column({ type: DataType.STRING(50), unique: true })
  username: string;

  @Column({ type: DataType.STRING(13), unique: true })
  mobile: string;

  @Column({ type: DataType.STRING(50), unique: true })
  email: string;

  @Column({ allowNull: false, type: DataType.STRING(110) })
  password: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM('admin', 'user', 'manager'),
    defaultValue: 'user',
  })
  role: string;

  @BelongsToMany(() => Business, {
    through: () => BusinessUser,
    as: 'businesses',
    foreignKey: 'user_uuid',
    sourceKey: 'uuid',
    otherKey: 'business_uuid',
    targetKey: 'uuid',
  })
  businesses: Business[];

  @HasMany(() => Event, {
    as: 'events',
    foreignKey: 'organizer_uuid',
    sourceKey: 'uuid',
    scope: {
      organizer_type: 'user',
    },
  })
  events: Event[];

  hasBusiness: BelongsToManyHasAssociationMixin<Business, Business['uuid']>;
  getBusinesses: BelongsToManyGetAssociationsMixin<Business>;
  setBusinesses: BelongsToManySetAssociationsMixin<Business, Business['uuid']>;
}
