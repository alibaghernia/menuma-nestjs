import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'businesses',
})
export class BusinessMetadata extends Model<BusinessMetadata> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  data: string;
}
