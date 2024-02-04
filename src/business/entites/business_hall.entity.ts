import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from './business.entity';
import { makeImageUrl } from 'src/utils/images';

@Table({
  tableName: 'business-halls',
  timestamps: true,
  underscored: true,
})
export class BusinessHall extends Model<BusinessHall> {
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
    get(this) {
      const image = this.getDataValue('image');
      if (image) this.setDataValue('image_url', makeImageUrl(image));
      return image;
    },
  })
  image?: string;
  image_url?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;
}
