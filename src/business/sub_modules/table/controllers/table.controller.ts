import { Controller, Get, Param } from '@nestjs/common';
import { TableService } from '../services/table.service';

@Controller('business/:business_slug/tables')
export class TableController {
  constructor(private tableService: TableService) {}

  @Get(':table_code')
  async getTable(
    @Param('business_slug') business_slug: string,
    @Param('table_code') table_code: string,
  ) {
    const table = await this.tableService.getTable(business_slug, table_code);
    return {
      ok: true,
      data: table,
    };
  }
}
