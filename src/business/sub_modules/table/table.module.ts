import { Module } from '@nestjs/common';
import { TablePanelService } from './services/table.panel.service';
import { TableService } from './services/table.service';
import { TableController } from './controllers/table.controller';
import { TablePanelController } from './controllers/table.panel.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BusinessTable } from 'src/business/entites/business_tables.entity';
import { Business } from 'src/business/entites/business.entity';

@Module({
  imports: [SequelizeModule.forFeature([BusinessTable, Business])],
  providers: [TablePanelService, TableService],
  controllers: [TableController, TablePanelController],
})
export class TableModule {}
