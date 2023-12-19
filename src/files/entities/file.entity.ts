import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { FileProduct } from 'src/product/entities/file_product.entity';
import { Product } from 'src/product/entities/product.entity';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'files',
  // paranoid: true,
})
export class File extends Model<File> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @BelongsToMany(() => Product, {
    through: () => FileProduct,
    as: 'products',
    foreignKey: 'file_uuid',
    otherKey: 'product_uuid',
    sourceKey: 'uuid',
    targetKey: 'uuid',
  })
  products: Product[];
}
