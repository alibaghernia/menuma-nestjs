import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from './business.entity';
import { User } from 'src/users/entites/user.entity';

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
}
