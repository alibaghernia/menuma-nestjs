import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { makeImageUrl } from 'src/utils/images';

@Table({
  tableName: 'catalogs',
  timestamps: true,
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
export class Catalog extends Model<Catalog> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.UUID,
  })
  image: string;

  @Column({
    type: DataType.STRING,
  })
  short_description: string;

  @Column({
    type: DataType.TEXT,
  })
  long_description: string;

  @Column({
    type: DataType.JSON,
  })
  labels: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  soon: boolean;

  setImages() {
    const image = this.getDataValue('image');
    if (image) this.setDataValue('image_url', makeImageUrl(image));
    return this;
  }
  image_url?: string;
}
