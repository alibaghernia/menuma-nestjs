import { Module } from '@nestjs/common';
import { ProductPanelService } from './services/product.panel.service';
import { ProductController } from './controllers/product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entites/user.entity';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { Tag } from 'src/database/entities/tag.entity';
import { Image } from 'src/database/entities/image.entity';
import { Business } from 'src/business/entites/business.entity';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { FileModule } from 'src/files/files.module';
import { ProductService } from './services/product.service';
import { ProductsPanelController } from './controllers/products.panel.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      User,
      Tag,
      Image,
      Business,
      BusinessCategory,
    ]),
    FileModule,
    AccessControlModule,
  ],
  providers: [ProductPanelService, ProductService],
  controllers: [ProductController, ProductsPanelController],
  exports: [ProductService, ProductPanelService],
})
export class ProductModule {}
