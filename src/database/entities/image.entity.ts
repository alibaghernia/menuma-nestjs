import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'images',
  timestamps: false,
})
export class Image extends Model<Image> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING })
  imageable_type: string;

  @Column({ type: DataType.UUID })
  imageable_uuid: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path: string;

  @Column({ type: DataType.JSON })
  metadata: object;
}
