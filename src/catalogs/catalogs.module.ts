import { Module } from '@nestjs/common';
import { CatalogsService } from './services/catalogs.service';
import { CatalogsPanelService } from './services/catalogs.panel.service';
import { CatalogsPanelController } from './controllers/catalogs.panel.controller';
import { CatalogsController } from './controllers/catalogs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Catalog } from './entities/catalog.entity';
import { AccessControlModule } from 'src/access_control/access_control.module';

@Module({
  imports: [SequelizeModule.forFeature([Catalog]), AccessControlModule],
  providers: [CatalogsService, CatalogsPanelService],
  controllers: [CatalogsPanelController, CatalogsController],
})
export class CatalogsModule {}
