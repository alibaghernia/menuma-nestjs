import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from './business.entity';
import { Category } from 'src/category/entities/category.entity';

@Table({
  tableName: 'business-category',
  timestamps: false,
})
export class BusinessCategory extends Model<BusinessCategory> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
  })
  business_uuid: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_uuid: string;
}
