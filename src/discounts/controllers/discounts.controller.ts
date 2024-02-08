import { Controller, Get, Param, Query } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { PublicFiltersDTO } from '../dto';
import { DiscountsService } from '../services/discounts.service';

@Controller('discounts')
@IsPublic()
export class DiscountsController {
  constructor(private discountsService: DiscountsService) {}

  @Get()
  async getAll(@Query() filters: PublicFiltersDTO) {
    const [discounts, total] = await this.discountsService.getAll(filters);
    return {
      ok: true,
      data: {
        items: discounts,
        total,
      },
    };
  }
  @Get(':uuid')
  async get(
    @Param('uuid') uuid: string,
    @Query('business_slug') business_slug: string,
    @Query('business_uuid') business_uuid: string,
  ) {
    const discount = await this.discountsService.get(
      uuid,
      business_slug || business_uuid,
    );
    return {
      ok: true,
      data: discount,
    };
  }
}
