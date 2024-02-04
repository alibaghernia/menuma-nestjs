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
import { BusinessHall } from './business_hall.entity';
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
    get(this) {
      const image = this.getDataValue('image');
      if (image) this.setDataValue('image_url', makeImageUrl(image));
      return image;
    },
  })
  image?: string;
  image_url?: string;

  @ForeignKey(() => BusinessHall)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  hall_uuid: string;
}
