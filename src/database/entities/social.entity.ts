import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'socials',
  timestamps: false,
})
export class Social extends Model<Social> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING })
  socialableType: string;

  @Column({ type: DataType.UUID })
  socialable_uuid: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  link: string;
}
