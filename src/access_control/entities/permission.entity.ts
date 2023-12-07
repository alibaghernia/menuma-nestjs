import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { RolePermission } from './role_permission.entity';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { BusinessUserPermission } from './business-user_permission.entity';

@Table({
  tableName: 'permissions',
  timestamps: false,
  paranoid: true,
})
export class Permission extends Model<Permission> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  action: string;

  @BelongsToMany(() => Role, {
    through: () => RolePermission,
    as: 'roles',
    foreignKey: 'permission_uuid',
    sourceKey: 'uuid',
    otherKey: 'role_uuid',
    targetKey: 'uuid',
  })
  roles: Role[];

  @BelongsToMany(() => BusinessUser, {
    through: () => BusinessUserPermission,
    as: 'businessUsers',
    foreignKey: 'permission_uuid',
    sourceKey: 'uuid',
    otherKey: 'business_user_uuid',
    targetKey: 'uuid',
  })
  businessUsers: BusinessUser[];
}
