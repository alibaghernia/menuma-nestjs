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
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { FiltersDTO } from '../dto/filters.dto';
import { ProductPanelService } from '../services/product.panel.service';
import { IsAdmin } from 'src/auth/decorators/is_public.decorator';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CreateProductAdminDTO } from '../dto/admin_panel.dto';

@Controller('panel/product')
@UseGuards(CheckPermissionsGuard)
@IsAdmin()
export class ProductsPanelController {
  constructor(private productPanelService: ProductPanelService) {}

  @Get()
  async getAll(@Query() filters: FiltersDTO) {
    const { products, total } =
      await this.productPanelService.fetchAll(filters);

    return {
      ok: true,
      data: {
        items: products,
        total,
      },
    };
  }
  @Get(':uuid')
  async get(@Param('uuid') uuid: string) {
    const item = await this.productPanelService.get(uuid);

    return {
      ok: true,
      data: item,
    };
  }
  @Post()
  async create(@Body() payload: CreateProductAdminDTO) {
    console.log({
      payload,
    });
    await this.productPanelService.create(payload);

    return {
      ok: true,
      message: 'Product created successfully!',
    };
  }
  @Put(':uuid')
  async update(
    @Param('uuid', new UUIDChecker('Product UUID')) uuid: string,
    @Body() payload: CreateProductAdminDTO,
  ) {
    await this.productPanelService.update(uuid, payload);

    return {
      ok: true,
      message: 'Product updated successfully!',
    };
  }
  @Delete(':uuid')
  async delete(@Param('uuid', new UUIDChecker('Product UUID')) uuid: string) {
    await this.productPanelService.delete(uuid);

    return {
      ok: true,
      message: 'Product deleted successfully!',
    };
  }
}
