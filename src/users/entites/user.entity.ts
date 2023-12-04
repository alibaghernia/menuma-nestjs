import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  underscored: true,
})
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUID,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  firstName: string;

  @Column({ type: DataType.STRING(50) })
  lastName: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  username: string;

  @Column({ type: DataType.STRING(13) })
  mobile: string;

  @Column({ type: DataType.STRING(50) })
  email: string;

  @Column({ allowNull: false, type: DataType.STRING(110) })
  password: string;
}
