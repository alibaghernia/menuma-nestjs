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
  readonly uuid: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  readonly title: string;

  @Column({
    type: DataType.NUMBER({ length: 3 }),
    allowNull: false,
  })
  readonly discount: number;

  @Column({
    type: DataType.STRING,
  })
  readonly description: string;

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
  readonly type: string;

  @ForeignKey(() => Business)
  business_uuid: string;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  readonly business: Business;
}
