import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { Role } from './role.entity';

@Table({
  tableName: 'business_user-role',
  timestamps: false,
  paranoid: true,
})
export class BusinessUserRole extends Model<BusinessUserRole> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => BusinessUser)
  business_user_uuid: string;

  @ForeignKey(() => Role)
  role_uuid: string;

  @BelongsTo(() => BusinessUser, {
    as: 'businessUser',
    foreignKey: 'business_user_uuid',
    targetKey: 'uuid',
  })
  businessUser: BusinessUser;

  @BelongsTo(() => Role, {
    as: 'role',
    foreignKey: 'role_uuid',
    targetKey: 'uuid',
  })
  role: Role;
}
