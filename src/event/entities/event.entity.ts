import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { File } from '../../files/entities/file.entity';
import { EventImage } from './event_image.entity';
import { Business } from 'src/business/entites/business.entity';
import { User } from 'src/users/entites/user.entity';
import { makeImageUrl } from 'src/utils/images';

@Table({
  timestamps: true,
  tableName: 'events',
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  hooks: {
    afterFind(model: any) {
      const task = (mo) => {
        mo?.setImages?.();
      };
      if (model?.length) model.forEach(task);
      else {
        task(model);
      }
    },
  },
})
export class Event extends Model<Event> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  title: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  start_at: string;

  @Column({ type: DataType.STRING(100) })
  end_at: string;

  @Column({ type: DataType.INTEGER() })
  limit: number;

  @Column({ type: DataType.UUID })
  banner_uuid: string;

  @Column({ type: DataType.TEXT })
  short_description: string;

  @Column({ type: DataType.TEXT })
  long_description: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  organizer_type: string;

  @Column({ type: DataType.UUID, allowNull: false })
  organizer_uuid: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  cycle: string;

  @Column({ type: DataType.INTEGER(), allowNull: true })
  price: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  pin: boolean;

  @BelongsToMany(() => File, {
    through: () => EventImage,
    as: 'images',
    foreignKey: 'event_uuid',
    sourceKey: 'uuid',
    otherKey: 'file_uuid',
    targetKey: 'uuid',
  })
  images: File[];

  @BelongsTo(() => Business, {
    as: 'business',
    foreignKey: 'organizer_uuid',
    targetKey: 'uuid',
  })
  business: Business;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'organizer_uuid',
    targetKey: 'uuid',
  })
  user: User;

  setImages() {
    const images = this.getDataValue('images');
    const banner = this.getDataValue('banner_uuid');
    if (images?.length)
      this.setDataValue('image_url', makeImageUrl(images[0].uuid));
    if (banner) this.setDataValue('banner_url', makeImageUrl(banner));
    return this;
  }
  banner_url?: string;
  image_url?: string;
}
