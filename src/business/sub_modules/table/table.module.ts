import { Module } from '@nestjs/common';
import { TablePanelService } from './services/table.panel.service';
import { TableService } from './services/table.service';
import { TableController } from './controllers/table.controller';
import { TablePanelController } from './controllers/table.panel.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';
import { BusinessTable } from './entitile/business_tables.entity';
import { QrCode } from 'src/qr-code/enitites/qr-code.entity';

@Module({
  imports: [SequelizeModule.forFeature([BusinessTable, Business, QrCode])],
  providers: [TablePanelService, TableService],
  controllers: [TableController, TablePanelController],
})
export class TableModule {}
