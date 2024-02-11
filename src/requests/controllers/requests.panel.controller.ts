import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { RequestsPanelService } from '../services/requests.panel.service';
import { FiltersDTO } from '../dto/filters.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';

@Controller('panel/requests')
export class RequestsPanelController {
  constructor(private requestsPanelService: RequestsPanelService) {}

  @Get()
  async getAll(@Query() filters: FiltersDTO) {
    const [items, total] = await this.requestsPanelService.getAll(filters);

    return {
      ok: true,
      data: {
        items,
        total,
      },
    };
  }
  @Delete(':uuid')
  async delete(@Param('uuid', new UUIDChecker('Request UUID')) uuid: string) {
    await this.requestsPanelService.delete(uuid);

    return {
      ok: true,
      message: 'Request deleted successfully!',
    };
  }
}
