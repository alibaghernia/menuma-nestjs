import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'files',
  paranoid: true,
})
export class File extends Model<File> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;
}
