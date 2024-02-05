import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from '../../business/entites/business.entity';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'customers',
  paranoid: true,
})
export class Customer extends Model<Customer> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  sur_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  gender: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  mobile: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  birthday: string;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  business_uuid: string;
}
