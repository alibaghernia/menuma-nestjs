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
import { business_permissions } from 'src/access_control/constants';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { HallPanelService } from '../services/hall.panel.service';
import { CreateHallDTO } from '../dto';
import { UpdateHallDTO } from '../dto/update.dto';
import { HallsFiltersDTO } from '../dto/filters.dto';

@Controller('panel/business/:business_uuid/halls')
export class HallPanelController {
  constructor(private hallPanelService: HallPanelService) {}

  @Get(':hall_uuid')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async getHall(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('hall_uuid', new UUIDChecker('Hall UUID'))
    hall_uuid: string,
  ) {
    const hall = await this.hallPanelService.getHall(business_uuid, hall_uuid);
    return {
      ok: true,
      data: hall,
    };
  }

  @Get()
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async getHalls(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: HallsFiltersDTO,
  ) {
    const halls = await this.hallPanelService.getHalls(business_uuid, filters);
    return {
      ok: true,
      data: halls,
    };
  }

  @Post()
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async createHall(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Body() payload: CreateHallDTO,
  ) {
    await this.hallPanelService.createHall(business_uuid, payload);
    return {
      ok: true,
      message: 'Business hall added successfully!',
    };
  }

  @Delete(':hall_uuid')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async removeHall(
    @Param('hall_uuid', new UUIDChecker('Hall UUID'))
    hall_uuid: string,
  ) {
    await this.hallPanelService.removeHall(hall_uuid);
    return {
      ok: true,
      message: 'Business hall removed successfully!',
    };
  }

  @Put(':hall_uuid')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async updateHall(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('hall_uuid', new UUIDChecker('Hall UUID'))
    hall_uuid: string,
    @Body() payload: UpdateHallDTO,
  ) {
    await this.hallPanelService.updateHall(business_uuid, hall_uuid, payload);
    return {
      ok: true,
      message: 'Business hall updated successfully!',
    };
  }
}
