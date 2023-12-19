import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { File } from 'src/files/entities/file.entity';
import { Product } from './product.entity';

@Table({
  tableName: 'file_product',
  timestamps: false,
})
export class FileProduct extends Model<FileProduct> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @ForeignKey(() => File)
  file_uuid: string;

  @ForeignKey(() => Product)
  product_uuid: string;
}
