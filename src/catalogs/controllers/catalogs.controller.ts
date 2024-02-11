import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogsService } from '../services/catalogs.service';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { FiltersDTO } from '../dto/filters.dto';

@Controller('catalogs')
export class CatalogsController {
  constructor(private catalogsService: CatalogsService) {}

  @Get()
  async getAll(@Query() filters: FiltersDTO) {
    const [items, total] = await this.catalogsService.getAll(filters);

    return {
      ok: true,
      data: {
        items,
        total,
      },
    };
  }
  @Get(':uuid')
  async get(@Param('uuid', new UUIDChecker('Catalog UUID')) uuid: string) {
    const item = await this.catalogsService.get(uuid);

    return {
      ok: true,
      data: item,
    };
  }
}
