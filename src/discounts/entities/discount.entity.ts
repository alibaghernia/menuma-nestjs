import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from 'src/business/entites/business.entity';
import { discountTypes } from '../dto';

@Table({
  timestamps: true,
  tableName: 'discounts',
  paranoid: true,
})
export class Discount extends Model<Discount> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.NUMBER({ length: 3 }),
    allowNull: false,
  })
  discount: number;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  pin: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: discountTypes.NORMAL,
  })
  type: string;

  @ForeignKey(() => Business)
  business_uuid: string;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;
}
