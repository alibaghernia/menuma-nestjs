import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';
import { NewPagerRequestDTO } from '../dto';
import { BusinessService } from '../services/business.service';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';

@Controller('business')
@UsePipes(UUIDCheckerController)
@IsPublic()
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get(':business_slug')
  async getBySlug(@Param('business_slug') business_slug: string) {
    try {
      const business = await this.businessService.findBySlug(business_slug);

      return {
        ok: true,
        data: business,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('pager-request')
  async pagerRequest(
    @Param('business_uuid') business_uuid: string,
    @Body() payload: NewPagerRequestDTO,
  ) {
    await this.businessService.createPagerRequest(business_uuid, payload);
    return {
      ok: true,
      message: 'pager request established successfully!',
    };
  }
  @Delete('pager-request/:request_uuid')
  async cencelPagerRequest(
    @Param('business_uuid') business_uuid: string,
    @Param('request_uuid') request_uuid: string,
  ) {
    await this.businessService.cancelPagerRequest(business_uuid, request_uuid);
    return {
      ok: true,
      message: 'pager request canceled successfully!',
    };
  }
}
