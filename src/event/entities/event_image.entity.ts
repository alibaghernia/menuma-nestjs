import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { File } from '../../files/entities/file.entity';
import { Event } from '../../event/entities/event.entity';

@Table({
  tableName: 'event-image',
  timestamps: false,
})
export class EventImage extends Model<EventImage> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.UUID,
  })
  event_uuid: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.UUID,
  })
  file_uuid: string;

  @BelongsTo(() => Event, {
    as: 'event',
    foreignKey: 'event_uuid',
    targetKey: 'uuid',
  })
  event: Event;

  @BelongsTo(() => File, {
    as: 'file',
    foreignKey: 'file_uuid',
    targetKey: 'uuid',
  })
  file: File;
}
