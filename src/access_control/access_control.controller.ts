import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckPermissionsGuard } from './guards/check_permissions.guard';
import { SessionGuard } from 'src/auth/guards';
import { AccessControlService } from './access_control.service';
import { CheckPermissions } from './decorators/check_permissions.decorator';
import { access_control } from './constants';
import {
  AssignPermissionToBusinessRoleDTO,
  CreateBusinessRoleDTO,
} from './dto/create.dto';

@Controller('access-control')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class AccessControlController {
  private logger = new Logger(AccessControlController.name);
  constructor(private accessConttolService: AccessControlService) {}

  @Get('/roles')
  @CheckPermissions([access_control.seeAllRoles.action])
  async getRoles() {
    this.logger.log('get system roles');
    try {
      const roles = await this.accessConttolService.getSystemRoles();
      return {
        ok: true,
        data: roles,
      };
    } catch (error) {
      this.logger.error('error getting system roles');
      throw error;
    }
  }

  @Get('/permissions')
  @CheckPermissions([access_control.seeAllPermissions.action])
  async getPermissions() {
    this.logger.log('get permissions');
    try {
      const permissions = await this.accessConttolService.getPermissions();
      return {
        ok: true,
        data: permissions,
      };
    } catch (error) {
      this.logger.error('error getting permissions');
      throw error;
    }
  }

  @Get('/roles/:role_uuid')
  @CheckPermissions([access_control.seeAllRoles.action])
  async getRole(@Param('role_uuid') role_uuid: string) {
    this.logger.log('get system roles');
    try {
      const role = await this.accessConttolService.getSystemRole(role_uuid);
      if (!role)
        throw new HttpException('Role not found!', HttpStatus.NOT_FOUND);
      return {
        ok: true,
        data: role,
      };
    } catch (error) {
      this.logger.error('error getting system roles');
      throw error;
    }
  }

  @Get('/roles/:role_uuid/permissions')
  @CheckPermissions([access_control.seeAllRoles.action])
  async getRolePermissions(@Param('role_uuid') role_uuid: string) {
    this.logger.log('get system roles');
    try {
      const permissions =
        await this.accessConttolService.getSystemRolePermissions(role_uuid);
      return {
        ok: true,
        data: permissions,
      };
    } catch (error) {
      this.logger.error('error getting system roles');
      throw error;
    }
  }

  @Get(':business_uuid/roles')
  @CheckPermissions([access_control.seeAllBusinessRoles.action])
  async getBusinessRoles(@Param('business_uuid') business_uuid: string) {
    this.logger.log('get business roles');
    try {
      const roles =
        await this.accessConttolService.getBusinessRoles(business_uuid);
      return {
        ok: true,
        data: roles,
      };
    } catch (error) {
      this.logger.error('error getting business roles');
      throw error;
    }
  }

  @Get(':business_uuid/roles/roles-permissions')
  @CheckPermissions([access_control.seeAllBusinessRoles.action])
  async getBusinessRolesWithPermissions(
    @Param('business_uuid') business_uuid: string,
  ) {
    this.logger.log('get business roles with permissions');
    try {
      const roles =
        await this.accessConttolService.getBusinessRolesWithPermissions(
          business_uuid,
        );
      return {
        ok: true,
        data: roles,
      };
    } catch (error) {
      this.logger.error('error getting business roles with permissions');
      throw error;
    }
  }

  @Get(':business_uuid/roles/:role_uuid/permissions')
  @CheckPermissions([access_control.seeAllBusinessRoles.action])
  async getBusinessRolePermissions(
    @Param('business_uuid') business_uuid: string,
    @Param('role_uuid') role_uuid: string,
  ) {
    this.logger.log('get business role permissions');
    try {
      const permissions =
        await this.accessConttolService.getBusinessRolePermissions(
          business_uuid,
          role_uuid,
        );
      return {
        ok: true,
        data: permissions,
      };
    } catch (error) {
      this.logger.error('error getting business role permissions');
      throw error;
    }
  }

  @Post(':business_uuid/roles')
  @CheckPermissions([access_control.createBusinessRole.action])
  async createBusinessRole(
    @Param('business_uuid') business_uuid: string,
    @Body() payload: CreateBusinessRoleDTO,
  ) {
    this.logger.log('create business role');
    try {
      await this.accessConttolService.createBusinessRole(
        business_uuid,
        payload,
      );
      return {
        ok: true,
        message: 'Business role created successfully!',
      };
    } catch (error) {
      this.logger.error('error create business role');
      throw error;
    }
  }

  @Post(':business_uuid/roles/:role_uuid/assign-permission')
  @CheckPermissions([access_control.updateBusinessRole.action])
  async assingPermissionToBusinessRole(
    @Param('business_uuid') business_uuid: string,
    @Param('role_uuid') role_uuid: string,
    @Body() payload: AssignPermissionToBusinessRoleDTO,
  ) {
    this.logger.log('assign permission to business role');
    try {
      await this.accessConttolService.assingPermissionToBusinessRole(
        business_uuid,
        role_uuid,
        payload,
      );
      return {
        ok: true,
        message: 'Assign permission to business role successfully!',
      };
    } catch (error) {
      this.logger.error('error assign permission to business role');
      throw error;
    }
  }
}
