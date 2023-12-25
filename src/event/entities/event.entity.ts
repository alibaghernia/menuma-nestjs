import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { File } from '../../files/entities/file.entity';
import { EventImage } from './event_image.entity';

@Table({
  underscored: true,
  timestamps: true,
  tableName: 'events',
  paranoid: true,
})
export class Event extends Model<Event> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  startAt: string;

  @Column({ type: DataType.STRING(100) })
  endAt: string;

  @Column({ type: DataType.INTEGER() })
  limit: number;

  @Column({ type: DataType.UUID })
  bannerId: string;

  @Column({ type: DataType.STRING(100) })
  shortDescription: string;

  @Column({ type: DataType.STRING(100) })
  longDescription: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  organizer_type: string;

  @Column({ type: DataType.UUID, allowNull: false })
  organizer_uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  cycle: string;

  @Column({ type: DataType.INTEGER(), allowNull: false })
  price: number;

  @BelongsToMany(() => File, {
    through: () => EventImage,
    as: 'images',
    foreignKey: 'event_uuid',
    sourceKey: 'uuid',
    otherKey: 'file_uuid',
    targetKey: 'uuid',
  })
  images: File[];
}
