import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from '../../../entites/business.entity';
import { PagerRequest } from '../../../entites/pager_request.entity';
import { BusinessHall } from '../../hall/entities/business_hall.entity';
import { makeImageUrl } from 'src/utils/images';

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

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  max_capacity: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string;
  setImageUrl() {
    const image = this.getDataValue('image');
    if (image) this.setDataValue('image_url', makeImageUrl(image));
    return this;
  }
  image_url: string;

  @ForeignKey(() => BusinessHall)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hall_uuid: string;
}
