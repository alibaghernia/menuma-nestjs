import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlPanelService } from '../services/access_control.panel.service';
import { CHECK_PERMISSIONS } from '../decorators/check_permissions.decorator';
import { Request } from 'express';
import { administratorAccessPermissions } from '../constants';

@Injectable()
export class CheckPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlPanelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { permissions, id_field, from_body } =
      this.reflector.getAllAndOverride<{
        permissions: string[];
        from_body?: boolean;
        id_field: string;
      }>(CHECK_PERMISSIONS, [context.getHandler(), context.getClass()]) || {};

    if (!permissions) return true;
    const request = context.switchToHttp().getRequest<Request>();
    if (request.user.role == 'admin') return true; // if user is admin prevent checking permissions
    const user_uuid = request.user.uuid;
    let business_uuid;
    if (!from_body) {
      business_uuid = request.params[id_field];
    } else {
      business_uuid = request.body[id_field];
    }

    if (
      //check admin permissions
      request.user.role != 'admin' &&
      administratorAccessPermissions.some((adPer) =>
        permissions.some((per) => per == adPer.action),
      )
    )
      throw new HttpException(
        "You don't have administration permissions!",
        HttpStatus.FORBIDDEN,
      );

    if (!business_uuid || business_uuid == ':business_uuid')
      throw new HttpException(
        "Business hasn't specified!",
        HttpStatus.FORBIDDEN,
      );

    for (const permission of permissions) {
      await this.accessControlService.checkUserPermission(
        { action: permission },
        business_uuid,
        user_uuid,
      );
    }
    return true;
  }
}
