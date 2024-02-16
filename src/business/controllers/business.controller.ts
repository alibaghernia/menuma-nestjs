import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';
import { NewPagerRequestDTO } from '../dto';
import { BusinessService } from '../services/business.service';
import { IsPublic } from 'src/auth/decorators/is_public.decorator';
import { BusinessesFiltersDTO, MenuFiltersDTO } from '../dto/filters.dto';
import { CheckBusinessExistsGuard } from '../guards/exists.guard';

@Controller('business')
@UsePipes(UUIDCheckerController)
@IsPublic()
export class BusinessController {
  constructor(private businessService: BusinessService) {}

  @Get()
  async getBusinesses(@Query() filters: BusinessesFiltersDTO) {
    const [businesses, total] =
      await this.businessService.getBusinesses(filters);
    return {
      ok: true,
      data: {
        businesses,
        total,
      },
    };
  }

  @Get(':business_slug')
  async getBySlug(@Param('business_slug') business_slug: string) {
    const business = await this.businessService.findBySlug(business_slug);
    return {
      ok: true,
      data: business,
    };
  }
  @Get(':business_slug/menu')
  async getMenu(
    @Param('business_slug') business_slug: string,
    @Query() filters: MenuFiltersDTO,
  ) {
    const business = await this.businessService.getMenu(business_slug, filters);
    return {
      ok: true,
      data: business,
    };
  }
  @Post(':business_slug/pager-request')
  @UseGuards(CheckBusinessExistsGuard)
  async pagerRequest(
    @Param('business_slug') business_slug: string,
    @Body() payload: NewPagerRequestDTO,
  ) {
    const request = await this.businessService.createPagerRequest(
      business_slug,
      payload,
    );
    return {
      ok: true,
      data: {
        request_uuid: request.uuid,
      },
      message: 'pager request established successfully!',
    };
  }
  @Delete(':business_slug/pager-request/:request_uuid')
  async cencelPagerRequest(
    @Param('business_slug') business_slug: string,
    @Param('request_uuid') request_uuid: string,
  ) {
    await this.businessService.cancelPagerRequest(business_slug, request_uuid);
    return {
      ok: true,
      message: 'pager request canceled successfully!',
    };
  }
}
