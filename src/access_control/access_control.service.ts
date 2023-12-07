import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entites/user.entity';
import { Business } from 'src/business/entites/business.entity';

@Injectable()
export class AccessControlService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Role) private roleRepo: typeof Role,
    @InjectModel(Permission) private permissionRepo: typeof Permission,
    @InjectModel(User) private userRepo: typeof User,
    @Inject(REQUEST) private request: Request,
  ) {}

  fetchAllRoles() {}

  async checkUserPermission(
    perDetail: { title?: string; action?: string },
    business_uuid: string,
    user_uuid: string,
  ) {
    const user = await this.userRepo.findOne({
      where: {
        uuid: user_uuid,
      },
      include: [
        {
          model: Business,
          where: {
            uuid: business_uuid,
          },
        },
      ],
    });

    if (!user)
      throw new HttpException(
        "You don't have permission to this business",
        HttpStatus.FORBIDDEN,
      );
    console.log({
      check: user.getBusinesses,
    });
    const business = await user.getBusinesses({
      where: { uuid: business_uuid },
    });
    console.log({
      business,
    });
  }
}
