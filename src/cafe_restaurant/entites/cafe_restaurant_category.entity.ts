import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CafeRestaurant } from './cafe_restaurant.entity';
import { Category } from 'src/category/entities/category.entity';

@Table({
  tableName: 'cafe_restaurant-category',
  timestamps: false,
})
export class CafeRestaurantCategory extends Model<CafeRestaurantCategory> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => CafeRestaurant)
  @Column({
    type: DataType.UUID,
  })
  cafe_restaurant_uuid: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_uuid: string;
}
