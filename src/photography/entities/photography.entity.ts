import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'photographies',
  paranoid: true,
})
export class PhotographyEntity extends Model<PhotographyEntity> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  cafe_name: string;

  @Column({ allowNull: false, type: DataType.STRING(24) })
  phone_number: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  description?: string;
}
