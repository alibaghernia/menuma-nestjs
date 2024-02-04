import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from './business.entity';
import { BusinessTable } from '../sub_modules/table/entitile/business_tables.entity';

@Table({
  tableName: 'pager-requests',
  timestamps: true,
  underscored: true,
})
export class PagerRequest extends Model<PagerRequest> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => Business)
  business_uuid: string;

  @ForeignKey(() => BusinessTable)
  table_uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @BelongsTo(() => BusinessTable, {
    as: 'table',
    foreignKey: 'table_uuid',
    targetKey: 'uuid',
  })
  table: BusinessTable;

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'business_uuid',
    targetKey: 'uuid',
  })
  business: Business;
}
