import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
//   import { Business } from 'src/business/entites/business.entity';
//   import { BusinessCategory } from 'src/business/entites/business_category.entity';
//   import { CategoryProduct } from 'src/product/entities/category_product.entity';
//   import { Product } from 'src/product/entities/product.entity';

@Table({
    tableName: 'events',
    timestamps: false,
})
export class Event extends Model<Event> {
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
    title: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    date: string;

    // ساعت شروع
    @Column({
        type: DataType.TIME,
        allowNull: true,
    })
    from: string;

    // ساعت پایان
    @Column({
        type: DataType.TIME,
        allowNull: true,
    })
    to: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string;

    // برگذار کننده میتواند یک کافه یا یک یوزر باشد
    @Column({
        type: DataType.STRING
    })
    organizer_type: string;

    @Column({
        type: DataType.UUID,
    })
    organizer_uuid: string;

    // ایدی بیزینسی ای که در ان برنامه برگذار میشود
    @Column({
        type: DataType.STRING,
    })
    place_uuid: string

    // عکس بنر
    // عکس های اسلایدر
    // توضیح کوتاه 90 کاراکتر
}