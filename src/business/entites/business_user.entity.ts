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
import { Business } from './business.entity';
import { User } from 'src/users/entites/user.entity';
import { BusinessUserRole } from 'src/access_control/entities/business-user_role.entity';
import { BusinessUserPermission } from 'src/access_control/entities/business-user_permission.entity';
import { Role } from 'src/access_control/entities/role.entity';
import { Permission } from 'src/access_control/entities/permission.entity';

@Table({
  tableName: 'business-user',
  timestamps: false,
})
export class BusinessUser extends Model<BusinessUser> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Business)
  business_uuid: string;

  @ForeignKey(() => User)
  user_uuid: string;

  @Column({
    type: DataType.ENUM('manager', 'employee'),
    defaultValue: 'employee',
    allowNull: false,
  })
  role: string;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'user_uuid',
    targetKey: 'uuid',
  })
  user: User;

  @HasMany(() => BusinessUserRole, {
    as: 'businessRoles',
    foreignKey: 'business_user_uuid',
    sourceKey: 'uuid',
  })
  businessRoles: BusinessUserRole[];

  @HasMany(() => BusinessUserPermission, {
    as: 'businessPermissions',
    foreignKey: 'business_user_uuid',
    sourceKey: 'uuid',
  })
  businessPermissions: BusinessUserPermission[];

  @BelongsToMany(() => Role, {
    through: () => BusinessUserRole,
    as: 'roles',
    foreignKey: 'business_user_uuid',
    sourceKey: 'uuid',
    otherKey: 'role_uuid',
    targetKey: 'uuid',
  })
  roles: Role[];

  @BelongsToMany(() => Permission, {
    through: () => BusinessUserPermission,
    as: 'permissions',
    foreignKey: 'business_user_uuid',
    sourceKey: 'uuid',
    otherKey: 'permission_uuid',
    targetKey: 'uuid',
  })
  permissions: Permission[];
}
