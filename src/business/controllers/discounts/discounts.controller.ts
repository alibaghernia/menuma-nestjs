import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { CheckBusinessExistsGuard } from 'src/business/guards/exists.guard';
import { PublicFiltersDTO } from 'src/discounts/dto';
import { DiscountsService } from 'src/discounts/services/discounts.service';

@Controller('business/:business_slug/discounts')
@UseGuards(CheckBusinessExistsGuard)
@IsPublic()
export class DiscountsController {
  constructor(private discountsService: DiscountsService) {}

  @Get()
  async getAll(@Req() req: Request, @Query() filters: PublicFiltersDTO) {
    const [discounts, total] = await this.discountsService.getAll({
      business_uuid: req.business_guard.uuid,
      ...filters,
    });
    return {
      ok: true,
      data: {
        items: discounts,
        total,
      },
    };
  }
  @Get(':uuid')
  async get(@Req() req: Request, @Param('uuid') uuid: string) {
    const discount = await this.discountsService.get(
      uuid,
      req.business_guard.uuid,
    );
    return {
      ok: true,
      data: discount,
    };
  }
}
