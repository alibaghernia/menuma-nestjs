import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { CategoryService } from './services/category.service';
import { CategoryPanelService } from './services/category.panel.service';
import { BusinessCategory } from 'src/business/entites/business_category.entity';
import { Business } from 'src/business/entites/business.entity';
import { AccessControlModule } from 'src/access_control/access_control.module';
import { BusinessCategoryProduct } from 'src/product/entities/business-category_product.entity';
import { CategoryPanelController } from './controllers/category.panel.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Category,
      BusinessCategory,
      Business,
      BusinessCategoryProduct,
    ]),
    AccessControlModule,
  ],
  providers: [CategoryService, CategoryPanelService],
  controllers: [CategoryController, CategoryPanelController],
  exports: [CategoryService, CategoryPanelService],
})
export class CategoryModule {}
