import { Controller, Get, Param } from '@nestjs/common';
import { HallService } from '../services/hall.service';

@Controller('business/:business_slug/halls')
export class HallController {
  constructor(private hallService: HallService) {}

  @Get(':hall_code')
  async getHall(
    @Param('business_slug') business_slug: string,
    @Param('hall_code') hall_code: string,
  ) {
    const hall = await this.hallService.getHall(business_slug, hall_code);
    return {
      ok: true,
      data: hall,
    };
  }
}
