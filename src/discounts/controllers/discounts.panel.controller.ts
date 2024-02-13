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
import { IsAdmin } from 'src/auth/decorators/is_public.decorator';
import { DiscountsPanelService } from '../services/discounts.panel.service';
import { CreateAdminDTO, FiltersDTO } from '../dto';

@Controller('panel/discounts')
@IsAdmin()
export class DiscountsPanelController {
  constructor(private discountsPanelService: DiscountsPanelService) {}

  @Get()
  async getAll(@Query() filters: FiltersDTO) {
    const [items, total] = await this.discountsPanelService.getAll(filters);
    return {
      ok: true,
      data: { items, total },
    };
  }
  @Get(':uuid')
  async get(@Param('uuid') uuid: string) {
    const item = await this.discountsPanelService.get(uuid);
    return {
      ok: true,
      data: item,
    };
  }
  @Post()
  async create(@Body() payload: CreateAdminDTO) {
    await this.discountsPanelService.create(payload);
    return {
      ok: true,
      message: 'Discount created successfully!',
    };
  }
  @Put(':uuid')
  async update(@Param('uuid') uuid: string, @Body() payload: CreateAdminDTO) {
    await this.discountsPanelService.update(uuid, payload);
    return {
      ok: true,
      message: 'Discount updated successfully!',
    };
  }
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string) {
    await this.discountsPanelService.remove(uuid);
    return {
      ok: true,
      message: 'Discount deleted successfully!',
    };
  }
}
