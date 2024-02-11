import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'requests',
  timestamps: true,
})
export class Request extends Model<Request> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;
}
