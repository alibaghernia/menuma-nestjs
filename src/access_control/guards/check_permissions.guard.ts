import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from '../access_control.service';
import { CHECK_PERMISSIONS } from '../decorators/check_permissions.decorator';
import { Request } from 'express';

@Injectable()
export class CheckPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { permissions, id_field, from_body } =
      this.reflector.getAllAndOverride<{
        permissions: string[];
        from_body?: boolean;
        id_field: string;
      }>(CHECK_PERMISSIONS, [context.getHandler(), context.getClass()]);

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
