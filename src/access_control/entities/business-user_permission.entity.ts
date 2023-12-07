import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { Permission } from './permission.entity';

@Table({
  tableName: 'business_user-permission',
  timestamps: false,
  paranoid: true,
})
export class BusinessUserPermission extends Model<BusinessUserPermission> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => BusinessUser)
  business_user_uuid: string;

  @ForeignKey(() => Permission)
  permission_uuid: string;

  @BelongsTo(() => BusinessUser, {
    as: 'businessUser',
    foreignKey: 'business_user_uuid',
    targetKey: 'uuid',
  })
  businessUser: BusinessUser;

  @BelongsTo(() => Permission, {
    as: 'permission',
    foreignKey: 'permission_uuid',
    targetKey: 'uuid',
  })
  permission: Permission;
}
