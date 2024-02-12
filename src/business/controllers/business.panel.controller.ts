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
  UsePipes,
} from '@nestjs/common';
import { BusinessPanelService } from '../services/business.panel.service';
import { CreateBusinessDTO } from '../dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import { UpdateBusinessDTO, UpdatePagerRequestDTO } from '../dto/update.dto';
import { NotEmptyPipe } from 'src/pipes/not_empty.pipe';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { business_permissions } from 'src/access_control/constants';
import { SetBusinessManagerDTO } from '../dto/set_business_manager';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import {
  PanelBusinessesFiltersDTO,
  PagerRequestsFiltersDTO,
} from '../dto/filters.dto';
import { UUIDCheckerController } from 'src/pipes/uuid_checker_controller.pipe';

@Controller('panel/business')
@UseGuards(CheckPermissionsGuard)
@UsePipes(new UUIDCheckerController('Business UUID', 'business_uuid'))
export class BusinessPanelController {
  constructor(private businessService: BusinessPanelService) {}

  @Get()
  @CheckPermissions([business_permissions.readBusinesses.action])
  async getAll(@Query() filters: PanelBusinessesFiltersDTO) {
    const businesses = await this.businessService.findAll(filters);
    return {
      ok: true,
      data: businesses,
    };
  }

  @Get(':slugOrId')
  @CheckPermissions([business_permissions.readBusinesses.action])
  async getBySlug(
    @Param('slugOrId', new NotEmptyPipe('Business Slug Or UUID'))
    slugOrId: string,
  ) {
    const business = await this.businessService.findBySlugOrId(slugOrId);
    return {
      ok: true,
      data: business,
    };
  }
  @Get(':uuid/statistics')
  async statistics(
    @Param('uuid', new NotEmptyPipe('Business UUID'))
    uuid: string,
  ) {
    const statistics = await this.businessService.statistics(uuid);
    return {
      ok: true,
      data: statistics,
    };
  }

  @Post()
  @CheckPermissions([business_permissions.createBusiness.action])
  @Roles(Role.Admin)
  async create(@Body() body: CreateBusinessDTO) {
    const business = await this.businessService.create(
      body as unknown as Required<CreateBusinessDTO>,
    );
    return {
      ok: true,
      message: `${business.name} crearted successfully!`,
    };
  }

  @Delete(':business_uuid')
  @CheckPermissions([business_permissions.removeBusiness.action])
  @Roles(Role.Admin)
  async remove(
    @Param('business_uuid', new UUIDChecker('Business UUID')) uuid: string,
  ) {
    await this.businessService.remove(uuid);
    return {
      ok: true,
      message: 'Business deleted successfully!',
    };
  }

  @Put(':business_uuid')
  @CheckPermissions([business_permissions.updateBusinessInfo.action])
  async update(
    @Param('business_uuid', new UUIDChecker('Business UUID')) uuid: string,
    @Body() payload: UpdateBusinessDTO,
  ) {
    await this.businessService.update(uuid, payload);
    return {
      ok: true,
      message: 'business updated successfully!',
    };
  }

  @Post(':business_uuid/add_user/:user_uuid')
  @CheckPermissions([business_permissions.addUserToBusiness.action])
  async addUser(
    @Param('business_uuid', new UUIDChecker('Business UUID')) id: string,
    @Param('user_uuid', new UUIDChecker('User UUID')) user_uuid: string,
  ) {
    await this.businessService.addUser(id, user_uuid);
    return {
      ok: true,
      message: 'User added to business successfully!',
    };
  }

  @Post(':business_uuid/set-manager')
  @CheckPermissions([business_permissions.setBusinessManager.action])
  async setBusinessManager(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Body() payload: SetBusinessManagerDTO,
  ) {
    await this.businessService.setBusinessManager(business_uuid, payload);
    return {
      ok: true,
      message: 'Business manager updated successfully!',
    };
  }

  @Get(':business_uuid/pager-requests')
  async getPagerRequests(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: PagerRequestsFiltersDTO,
  ) {
    const requests = await this.businessService.getPagerRequests(
      business_uuid,
      filters,
    );

    return {
      ok: true,
      data: requests,
    };
  }

  @Get(':business_uuid/pager-requests/:request_uuid')
  async getPagerRequest(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('request_uuid', new UUIDChecker('Request UUID'))
    request_uuid: string,
  ) {
    const request = await this.businessService.getPagerRequest(
      business_uuid,
      request_uuid,
    );

    return {
      ok: true,
      data: request,
    };
  }
  @Delete(':business_uuid/pager-requests/:request_uuid')
  async deletePagerRequest(
    @Param('request_uuid', new UUIDChecker('Request UUID'))
    request_uuid: string,
  ) {
    const request = await this.businessService.deletePagerRequest(request_uuid);

    return {
      ok: true,
      data: request,
    };
  }
  @Put(':business_uuid/pager-requests/:request_uuid')
  async updatePagerRequest(
    @Param('business_uuid') business_uuid: string,
    @Param('request_uuid', new UUIDChecker('Request UUID'))
    request_uuid: string,
    @Body() payload: UpdatePagerRequestDTO,
  ) {
    await this.businessService.updatePagerRequest(
      business_uuid,
      request_uuid,
      payload,
    );

    return {
      ok: true,
      message: 'pager request updated successfully!',
    };
  }
}
