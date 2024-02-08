import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from '../../business/entites/business.entity';

@Table({
  timestamps: true,
  tableName: 'customers',
})
export class Customer extends Model<Customer> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  first_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  last_name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  gender: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  mobile: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  birth_date: string;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  business_uuid: string;
}
