import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from 'src/business/entites/business.entity';

@Table({
  tableName: 'qr-codes',
  timestamps: false,
})
export class QrCode extends Model<QrCode> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Business)
  business_uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.JSON,
  })
  metadata: any;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;
}
