import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';
import { NewPagerRequestDTO } from '../dto';
import { BusinessService } from '../services/business.service';

@Controller('business/:business_uuid')
@UsePipes(UUIDCheckerController)
export class BusinessController {
  constructor(private businessService: BusinessService) {}

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
  async cencelPagerRequest(@Param('request_uuid') request_uuid: string) {
    await this.businessService.cancelPagerRequest(request_uuid);
    return {
      ok: true,
      message: 'pager request canceled successfully!',
    };
  }
}
