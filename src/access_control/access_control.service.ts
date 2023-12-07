import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import * as _ from 'lodash';

@Injectable()
export class AccessControlService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Role) private roleRepo: typeof Role,
    @InjectModel(Permission) private permissionRepo: typeof Permission,
    @InjectModel(BusinessUser) private businessUserRepo: typeof BusinessUser,
    @Inject(REQUEST) private request: Request,
  ) {}

  fetchAllRoles() {}

  async checkUserPermission(
    perDetail: { title?: string; action?: string },
    business_uuid: string,
    user_uuid: string,
  ) {
    const businessUser = await this.businessUserRepo.findOne({
      where: {
        user_uuid,
        business_uuid,
      },
      include: [{ model: Role, include: [Permission] }, Permission],
    });

    if (!businessUser)
      throw new HttpException(
        "You don't have permission to this business",
        HttpStatus.FORBIDDEN,
      );

    const permissions = businessUser.permissions;
    const rolePermissions = businessUser.roles
      .map((item) => item.permissions)
      .flat();
    const allPermissions = _.uniqBy(
      permissions.concat(rolePermissions),
      (item) => item.action,
    );
    const hasPermission = allPermissions.some(
      (item) =>
        item.title == perDetail.title || item.action == perDetail.action,
    );
    if (!hasPermission)
      throw new HttpException(
        `You don't have enough permissions to perform ${
          perDetail.action ? `${perDetail.action} action` : perDetail.title
        }`,
        HttpStatus.FORBIDDEN,
      );
  }
}
