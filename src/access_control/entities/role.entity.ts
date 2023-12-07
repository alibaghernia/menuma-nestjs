import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from 'src/business/entites/business.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role_permission.entity';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { BusinessUserRole } from './business-user_role.entity';

@Table({
  tableName: 'roles',
  timestamps: false,
  paranoid: true,
})
export class Role extends Model<Role> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
  })
  business_uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  businesses: Business[];

  @BelongsToMany(() => Permission, {
    through: () => RolePermission,
    as: 'permissions',
    foreignKey: 'role_uuid',
    sourceKey: 'uuid',
    otherKey: 'permission_uuid',
    targetKey: 'uuid',
  })
  permissions: Permission[];

  @BelongsToMany(() => BusinessUser, {
    through: () => BusinessUserRole,
    as: 'businessUsers',
    foreignKey: 'role_uuid',
    sourceKey: 'uuid',
    otherKey: 'business_user_uuid',
    targetKey: 'uuid',
  })
  businessUsers: BusinessUser[];
}
