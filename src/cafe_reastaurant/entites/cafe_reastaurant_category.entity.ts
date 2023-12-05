import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeReastaurant } from './cafe_reastaurant.entity';
import { Category } from 'src/category/entities/category.entity';

@Table({
  tableName: 'cafe_reastaurant-category',
  timestamps: false,
})
export class CafeReastaurantCategory extends Model<CafeReastaurantCategory> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => CafeReastaurant)
  @Column({
    type: DataType.UUID,
  })
  cafe_reastaurant_uuid: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_uuid: string;
}
