import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import * as _ from 'lodash';
import {
  AssignPermissionToBusinessRoleDTO,
  CreateBusinessRoleDTO,
} from '../dto/create.dto';
import { administratorAccessPermissions } from '../constants';
import { Op } from 'sequelize';

@Injectable()
export class AccessControlPanelService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Role) private roleRepo: typeof Role,
    @InjectModel(Permission) private permissionRepo: typeof Permission,
    @InjectModel(BusinessUser) private businessUserRepo: typeof BusinessUser,
    @Inject(REQUEST) private request: Request,
  ) {}

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

  async getPermissions() {
    return this.permissionRepo.findAll({
      where: {
        [Op.not]: {
          [Op.or]: administratorAccessPermissions.map((item) => ({
            uuid: item.uuid,
          })),
        },
      },
    });
  }
  async getSystemRoles() {
    return this.roleRepo.findAll({
      where: {
        business_uuid: '',
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
  }
  async getSystemRole(role_uuid: string) {
    return this.roleRepo.findOne({
      where: {
        uuid: role_uuid,
        business_uuid: '',
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
  }
  async getSystemRolePermissions(role_uuid: string) {
    const role = await this.roleRepo.findOne({
      where: {
        uuid: role_uuid,
        business_uuid: '',
      },
      include: [
        {
          model: Permission,
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    if (!role) throw new HttpException('Role not found!', HttpStatus.NOT_FOUND);

    return role.permissions || [];
  }
  async getBusinessRoles(business_uuid: string) {
    return this.roleRepo.findAll({
      where: {
        business_uuid,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
  }
  async getBusinessRolesWithPermissions(business_uuid: string) {
    return this.roleRepo.findAll({
      where: {
        business_uuid,
      },
      include: [
        {
          model: Permission,
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ['business_uuid'],
      },
    });
  }
  async getBusinessRolePermissions(business_uuid: string, role_uuid: string) {
    const role = await this.roleRepo.findOne({
      where: {
        business_uuid,
        uuid: role_uuid,
      },
      include: [
        {
          model: Permission,
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    return role?.permissions || [];
  }
  async getBusinessUserRoles(business_uuid: string, user_uuid: string) {
    const businessUser = (
      await this.businessUserRepo.findOne({
        where: {
          business_uuid,
          user_uuid,
        },
        include: [
          {
            model: Role,
            attributes: {
              exclude: ['business_uuid'],
            },
            through: {
              attributes: [],
            },
          },
        ],
      })
    )?.get({ plain: true });
    if (!businessUser)
      throw new HttpException(
        'Business or User is not valid!',
        HttpStatus.BAD_REQUEST,
      );
    return businessUser.roles;
  }
  async getBusinessUserRolePermissions(
    business_uuid: string,
    user_uuid: string,
    role_uuid: string,
  ) {
    const businessUser = (
      await this.businessUserRepo.findOne({
        where: {
          business_uuid,
          user_uuid,
        },
        include: [
          {
            model: Role,
            attributes: {
              exclude: ['business_uuid'],
            },
            include: [
              {
                model: Permission,
                through: {
                  attributes: [],
                },
              },
            ],
            through: {
              attributes: [],
            },
            where: {
              uuid: role_uuid,
            },
          },
          {
            model: Permission,
            through: {
              attributes: [],
            },
          },
        ],
      })
    )?.get({ plain: true });
    if (!businessUser)
      throw new HttpException('Entry is not valid!', HttpStatus.BAD_REQUEST);
    const permissions = businessUser.roles
      .map((role) => role.permissions)
      .concat(businessUser.permissions)
      .flat();
    return _.uniqBy(permissions, (item) => item.uuid);
  }

  async createBusinessRole(
    business_uuid: string,
    payload: CreateBusinessRoleDTO,
  ) {
    return this.roleRepo.create({
      business_uuid,
      title: payload.title,
    });
  }
  async assingPermissionToBusinessRole(
    business_uuid: string,
    role_uuid: string,
    payload: AssignPermissionToBusinessRoleDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const role = await this.roleRepo.findOne({
        where: {
          uuid: role_uuid,
          business_uuid,
        },
      });
      if (!role)
        throw new HttpException('Role not found!', HttpStatus.NOT_FOUND);

      const administratorPermissionsIds = administratorAccessPermissions.map(
        (item) => item.uuid,
      );
      if (
        administratorPermissionsIds.some(
          (item) => item == payload.permission_uuid,
        )
      )
        throw new HttpException(
          "You don't have permission to do this action!",
          HttpStatus.FORBIDDEN,
        );

      if (payload.permission_uuid) role.addPermission(payload.permission_uuid);
      else role.addPermissions(payload.permissions_uuid);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async unassingPermissionToBusinessRole(
    business_uuid: string,
    role_uuid: string,
    payload: AssignPermissionToBusinessRoleDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const role = await this.roleRepo.findOne({
        where: {
          uuid: role_uuid,
          business_uuid,
        },
      });
      if (!role)
        throw new HttpException('Role not found!', HttpStatus.NOT_FOUND);

      const administratorPermissionsIds = administratorAccessPermissions.map(
        (item) => item.uuid,
      );
      if (
        administratorPermissionsIds.some(
          (item) => item == payload.permission_uuid,
        )
      )
        throw new HttpException(
          "You don't have permission to do this action!",
          HttpStatus.FORBIDDEN,
        );

      if (payload.permission_uuid)
        role.removePermission(payload.permission_uuid);
      else role.removePermissions(payload.permissions_uuid);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
