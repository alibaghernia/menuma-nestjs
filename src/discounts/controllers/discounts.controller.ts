import { Controller, Get, Query } from '@nestjs/common';
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
}
