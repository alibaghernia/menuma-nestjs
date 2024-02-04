import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { business_permissions } from 'src/access_control/constants';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { CreateTableDTO } from 'src/business/dto';
import { TablesFiltersDTO } from 'src/business/dto/filters.dto';
import { UpdateTableDTO } from 'src/business/dto/update.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { TablePanelService } from '../services/table.panel.service';

@Controller('panel/business/:business_uuid/tables')
export class TablePanelController {
  constructor(private tablePanelService: TablePanelService) {}

  @Get(':table_uuid')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async getTable(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('table_uuid', new UUIDChecker('Table UUID'))
    table_uuid: string,
  ) {
    const table = await this.tablePanelService.getTable(
      business_uuid,
      table_uuid,
    );
    return {
      ok: true,
      data: table,
    };
  }

  @Get()
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async getTables(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: TablesFiltersDTO,
  ) {
    const tables = await this.tablePanelService.getTables(
      business_uuid,
      filters,
    );
    return {
      ok: true,
      data: tables,
    };
  }

  @Post()
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async createTable(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Body() payload: CreateTableDTO,
  ) {
    await this.tablePanelService.createTable(business_uuid, payload);
    return {
      ok: true,
      message: 'Business table added successfully!',
    };
  }

  @Delete(':table_uuid')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async removeTable(
    @Param('table_uuid', new UUIDChecker('Table UUID'))
    table_uuid: string,
  ) {
    await this.tablePanelService.removeTable(table_uuid);
    return {
      ok: true,
      message: 'Business table removed successfully!',
    };
  }

  @Put(':table_uuid')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async updateTable(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('table_uuid', new UUIDChecker('Table UUID'))
    table_uuid: string,
    @Body() payload: UpdateTableDTO,
  ) {
    await this.tablePanelService.updateTable(
      business_uuid,
      table_uuid,
      payload,
    );
    return {
      ok: true,
      message: 'Business table updated successfully!',
    };
  }
}
