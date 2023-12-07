import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { CreateProductDTO } from './dto/create.dto';
import { REQUEST } from '@nestjs/core';
import { User } from 'src/users/entites/user.entity';
import { Request } from 'express';
import { Business } from 'src/business/entites/business.entity';
import { BelongsToManyHasAssociationMixinOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(User) private userRepository: typeof User,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(payload: CreateProductDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.userRepository.findOne({
        where: {
          uuid: this.request.user.uuid,
        },
        include: [
          {
            model: Business,
            where: {
              uuid: payload.business_uuid,
            },
          },
        ],
      });
      if (!user)
        throw new HttpException(
          'Cafe Restaurant not found!',
          HttpStatus.NOT_FOUND,
        );
      const hasPermission = await user.hasBusiness(payload.business_uuid, {
        through: {
          where: {
            role: 'manager',
          },
        },
      } as BelongsToManyHasAssociationMixinOptions);
      if (!hasPermission)
        throw new HttpException(
          "You don't have enough permission to perform this action",
          HttpStatus.FORBIDDEN,
        );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
