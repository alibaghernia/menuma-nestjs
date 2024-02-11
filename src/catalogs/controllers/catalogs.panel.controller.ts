import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { catalogs_permissions } from 'src/access_control/constants';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { CatalogsPanelService } from '../services/catalogs.panel.service';
import { FiltersDTO } from '../dto/filters.dto';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CreateDTO } from '../dto/create.dto';

@Controller('panel/catalogs')
@UseGuards(CheckPermissionsGuard)
export class CatalogsPanelController {
  constructor(private catalogsPanelService: CatalogsPanelService) {}

  @Get()
  @CheckPermissions([catalogs_permissions.read.action])
  async getAll(@Query() filters: FiltersDTO) {
    const [items, total] = await this.catalogsPanelService.getAll(filters);

    return {
      ok: true,
      data: {
        items,
        total,
      },
    };
  }
  @Get(':uuid')
  @CheckPermissions([catalogs_permissions.read.action])
  async get(@Param('uuid', new UUIDChecker('Catalog UUID')) uuid: string) {
    const item = await this.catalogsPanelService.get(uuid);

    return {
      ok: true,
      data: item,
    };
  }
  @Put(':uuid')
  @CheckPermissions([catalogs_permissions.write.action])
  async update(
    @Param('uuid', new UUIDChecker('Catalog UUID')) uuid: string,
    @Body() payload: CreateDTO,
  ) {
    await this.catalogsPanelService.update(uuid, payload);

    return {
      ok: true,
      message: 'Catalog updated successfully!',
    };
  }
  @Post()
  @CheckPermissions([catalogs_permissions.write.action])
  async create(@Body() payload: CreateDTO) {
    await this.catalogsPanelService.create(payload);

    return {
      ok: true,
      message: 'Catalog created successfully!',
    };
  }
  @Delete(':uuid')
  @CheckPermissions([catalogs_permissions.write.action])
  async delete(@Param('uuid', new UUIDChecker('Catalog UUID')) uuid: string) {
    await this.catalogsPanelService.delete(uuid);

    return {
      ok: true,
      message: 'Catalog deleted successfully!',
    };
  }
}
