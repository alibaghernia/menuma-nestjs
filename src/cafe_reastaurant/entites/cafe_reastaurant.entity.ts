import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  underscored: true,
  timestamps: true,
})
export class CafeReastaurant extends Model<CafeReastaurant> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  slug: string;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  status: boolean;

  @Column({ type: DataType.STRING(100) })
  address: string;

  @Column({ type: DataType.STRING(100) })
  description: string;

  @Column({ type: DataType.STRING(20) })
  location_lat: string;

  @Column({ type: DataType.STRING(20) })
  location_long: string;

  @Column({ type: DataType.STRING(100) })
  instagram: string;

  @Column({ type: DataType.STRING(100) })
  telegram: string;

  @Column({ type: DataType.STRING(100) })
  twitter_x: string;

  @Column({ type: DataType.STRING(100) })
  whatsapp: string;

  @Column({ type: DataType.STRING(20) })
  phone_number: string;

  @Column({ type: DataType.STRING(20) })
  email: string;

  @Column({ type: DataType.JSON })
  working_hours: any[];

  @Column({ type: DataType.STRING })
  logo: string;

  @Column({ type: DataType.STRING })
  banner: string;
}
