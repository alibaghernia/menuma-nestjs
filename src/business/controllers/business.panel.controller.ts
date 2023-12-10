import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BusinessPanelService } from '../services/business.panel.service';
import { CreateBusinessDTO } from '../dto';
import { SessionGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/misc/role.enum';
import { UpdateBusinessDTO } from '../dto/update.dto';
import { NotEmptyPipe } from 'src/pipes/not_empty.pipe';
import { UUIDChecker } from 'src/pipes/uuid_checker.pipe';
import { CheckPermissions } from 'src/access_control/decorators/check_permissions.decorator';
import { business_permissions } from 'src/access_control/constants';

@Controller('business')
@UseGuards(SessionGuard)
export class BusinessPanelController {
  constructor(private businessService: BusinessPanelService) {}

  @Get()
  @CheckPermissions([business_permissions.readBusinesses.action])
  getAll() {
    return this.businessService.findAll();
  }

  @Get(':slugOrId')
  @CheckPermissions([business_permissions.readBusinesses.action])
  getBySlug(
    @Param('slugOrId', new NotEmptyPipe('Business Slug Or UUID'))
    slugOrId: string,
  ) {
    return this.businessService.findBySlugOrId(slugOrId);
  }

  @Post('/create')
  @CheckPermissions([business_permissions.createBusiness.action])
  @Roles(Role.Admin)
  async create(@Body() body: CreateBusinessDTO) {
    try {
      const business = await this.businessService.create(
        body as unknown as Required<CreateBusinessDTO>,
      );
      return {
        ok: true,
        message: `${business.name} crearted successfully!`,
      };
    } catch (error) {
      console.log({
        error,
      });
      throw new HttpException(
        'Business creation error!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Delete(':business_uuid')
  @CheckPermissions([business_permissions.removeBusiness.action])
  @Roles(Role.Admin)
  async remove(
    @Param('business_uuid', new UUIDChecker('Business UUID')) uuid: string,
  ) {
    try {
      await this.businessService.remove(uuid);
      return {
        ok: true,
        message: 'Business deleted successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while deleting business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':business_uuid')
  @CheckPermissions([business_permissions.updateBusinessInfo.action])
  async update(
    @Param('business_uuid', new UUIDChecker('Business UUID')) uuid: string,
    @Body() payload: UpdateBusinessDTO,
  ) {
    try {
      await this.businessService.update(uuid, payload);
      return {
        ok: true,
        message: 'business updated successfully!',
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating business!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':business_uuid/add_user/:user_uuid')
  @CheckPermissions([business_permissions.addUserToBusiness.action])
  async addUser(
    @Param('business_uuid', new UUIDChecker('Business UUID')) id: string,
    @Param('user_uuid', new UUIDChecker('User UUID')) user_uuid: string,
    @Query('role') role: any,
  ) {
    try {
      await this.businessService.addUser(id, user_uuid, role);
      return {
        ok: true,
        message: 'business updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}