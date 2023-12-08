import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'tags',
  timestamps: false,
})
export class Tag extends Model<Tag> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING })
  tagable_type: string;

  @Column({ type: DataType.UUID })
  tagable_uuid: string;

  @Column({
    type: DataType.STRING,
  })
  value: string;
}
