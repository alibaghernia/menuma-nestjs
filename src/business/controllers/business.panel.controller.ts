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
} from '@nestjs/common';
import { BusinessPanelService } from '../services/business.panel.service';
import { CreateBusinessDTO, CreateHallDTO, CreateTableDTO } from '../dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import {
  UpdateBusinessDTO,
  UpdateHallDTO,
  UpdatePagerRequestDTO,
  UpdateTableDTO,
} from '../dto/update.dto';
import { NotEmptyPipe } from 'src/pipes/not_empty.pipe';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { business_permissions } from 'src/access_control/constants';
import { SetBusinessManagerDTO } from '../dto/set_business_manager';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import {
  BusinessesFiltersDTO,
  HallsFiltersDTO,
  PagerRequestsFiltersDTO,
  TablesFiltersDTO,
} from '../dto/filters.dto';

@Controller('panel/business')
@UseGuards(CheckPermissionsGuard)
export class BusinessPanelController {
  constructor(private businessService: BusinessPanelService) {}

  @Get()
  @CheckPermissions([business_permissions.readBusinesses.action])
  async getAll(@Query() filters: BusinessesFiltersDTO) {
    const businesses = await this.businessService.findAll(filters);
    return {
      ok: true,
      data: businesses,
    };
  }

  @Get(':slugOrId')
  // @CheckPermissions([business_permissions.readBusinesses.action])
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

  @Post('/create')
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

  @Get(':business_uuid/tables/:table_uuid')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async getTable(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('table_uuid', new UUIDChecker('Table UUID'))
    table_uuid: string,
  ) {
    const table = await this.businessService.getTable(
      business_uuid,
      table_uuid,
    );
    return {
      ok: true,
      data: table,
    };
  }

  @Get(':business_uuid/tables')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async getTables(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: TablesFiltersDTO,
  ) {
    const tables = await this.businessService.getTables(business_uuid, filters);
    return {
      ok: true,
      data: tables,
    };
  }

  @Post(':business_uuid/tables')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async createTable(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Body() payload: CreateTableDTO,
  ) {
    await this.businessService.createTable(business_uuid, payload);
    return {
      ok: true,
      message: 'Business table added successfully!',
    };
  }

  @Delete(':business_uuid/tables/:table_uuid')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async removeTable(
    @Param('table_uuid', new UUIDChecker('Table UUID'))
    table_uuid: string,
  ) {
    await this.businessService.removeTable(table_uuid);
    return {
      ok: true,
      message: 'Business table removed successfully!',
    };
  }

  @Put(':business_uuid/tables/:table_uuid')
  @CheckPermissions([business_permissions.manageBusinessTables.action])
  async updateTable(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('table_uuid', new UUIDChecker('Table UUID'))
    table_uuid: string,
    @Body() payload: UpdateTableDTO,
  ) {
    await this.businessService.updateTable(business_uuid, table_uuid, payload);
    return {
      ok: true,
      message: 'Business table updated successfully!',
    };
  }

  @Get(':business_uuid/halls')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async getHalls(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Query() filters: HallsFiltersDTO,
  ) {
    const halls = await this.businessService.getHalls(business_uuid, filters);
    return {
      ok: true,
      data: halls,
    };
  }

  @Post(':business_uuid/halls')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async createHall(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Body() payload: CreateHallDTO,
  ) {
    await this.businessService.createHall(business_uuid, payload);
    return {
      ok: true,
      message: 'Business hall added successfully!',
    };
  }

  @Delete(':business_uuid/halls/:hall_uuid')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async removeHall(
    @Param('hall_uuid', new UUIDChecker('Hall UUID'))
    hall_uuid: string,
  ) {
    await this.businessService.removeHall(hall_uuid);
    return {
      ok: true,
      message: 'Business hall removed successfully!',
    };
  }

  @Put(':business_uuid/halls/:hall_uuid')
  @CheckPermissions([business_permissions.manageBusinessHalls.action])
  async updateHall(
    @Param('business_uuid', new UUIDChecker('Business UUID'))
    business_uuid: string,
    @Param('hall_uuid', new UUIDChecker('Hall UUID'))
    hall_uuid: string,
    @Body() payload: UpdateHallDTO,
  ) {
    await this.businessService.updateHall(business_uuid, hall_uuid, payload);
    return {
      ok: true,
      message: 'Business hall updated successfully!',
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
    @Param('request_uuid', new UUIDChecker('Request UUID'))
    request_uuid: string,
    @Body() payload: UpdatePagerRequestDTO,
  ) {
    await this.businessService.updatePagerRequest(request_uuid, payload);

    return {
      ok: true,
      message: 'pager request updated successfully!',
    };
  }
}
