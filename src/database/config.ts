import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { config as dotenvConfig } from 'dotenv';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { Social } from './entities/social.entity';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { User } from 'src/users/entites/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Business } from 'src/business/entites/business.entity';
import { Product } from 'src/product/entities/product.entity';
import { Role } from 'src/access_control/entities/role.entity';
import { Permission } from 'src/access_control/entities/permission.entity';
import { RolePermission } from 'src/access_control/entities/role_permission.entity';
import { BusinessUserRole } from 'src/access_control/entities/business-user_role.entity';
import { BusinessUserPermission } from 'src/access_control/entities/business-user_permission.entity';
import { Tag } from './entities/tag.entity';
import { BusinessCategoryProduct } from 'src/product/entities/business-category_product.entity';
import { Image } from './entities/image.entity';
import { QrCode } from 'src/qr-code/enitites/qr-code.entity';
import { File } from '../files/entities/file.entity';
import { FileProduct } from 'src/product/entities/file_product.entity';
import { PagerRequest } from 'src/business/entites/pager_request.entity';
import { Event } from '../event/entities/event.entity';
import { EventImage } from '../event/entities/event_image.entity';
import { PhotographyEntity } from '../photography/entities/photography.entity';
import { BusinessTable } from 'src/business/sub_modules/table/entitile/business_tables.entity';
import { BusinessHall } from 'src/business/sub_modules/hall/entities/business_hall.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Discount } from 'src/discounts/entities/discount.entity';

dotenvConfig({ path: '.env' });

const config: SequelizeModuleOptions = {
  dialect: 'mariadb',
  host: `${process.env.DB_HOST}`,
  port: +`${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  logging: (process.env.ORM_LOGGING || 'true') == 'true',
  models: [
    QrCode,
    File,
    FileProduct,
    User,
    Category,
    Business,
    Product,
    BusinessUser,
    BusinessCategory,
    Image,
    Social,
    Tag,
    Role,
    Permission,
    RolePermission,
    BusinessUserRole,
    BusinessUserPermission,
    BusinessCategoryProduct,
    BusinessTable,
    BusinessHall,
    PagerRequest,
    Event,
    EventImage,
    PhotographyEntity,
    Customer,
    Discount,
  ],
};

export default registerAs('sequelize', () => config);
