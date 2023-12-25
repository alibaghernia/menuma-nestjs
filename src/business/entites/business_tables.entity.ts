import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from './business.entity';
import { PagerRequest } from './pager_request.entity';

@Table({
  tableName: 'business-tables',
  timestamps: true,
  underscored: true,
})
export class BusinessTable extends Model<BusinessTable> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  business_uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;

  @HasMany(() => PagerRequest, {
    as: 'pagerRequests',
    foreignKey: 'table_uuid',
    sourceKey: 'uuid',
  })
  pagerRequests: PagerRequest[];
}
