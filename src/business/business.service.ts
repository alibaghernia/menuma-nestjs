import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './entites/business.entity';
import { HasManyAddAssociationsMixinOptions, WhereOptions } from 'sequelize';
import { CreateBusinessDTO } from './dto';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';
import { UpdateBusinessDTO } from './dto/update.dto';
import { Op } from 'sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entites/user.entity';

@Injectable()
export class BusinessService {
  private logger = new Logger(BusinessService.name);
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Social)
    private socialRepository: typeof Social,
    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
  ) {}

  findAll() {
    this.logger.log('fetch all businesses');
    return this.businessRepository.findAll({
      include: [
        {
          model: Social,
          attributes: {
            exclude: ['uuid', 'socialable_type', 'socialable_uuid'],
          },
        },
      ],
    });
  }

  findBySlugOrId(slugOrId: string) {
    return this.businessRepository.findOne({
      where: {
        [Op.or]: {
          slug: slugOrId,
          uuid: slugOrId,
        },
      },
      include: [
        {
          model: Social,
          attributes: {
            exclude: ['uuid', 'socialable_type', 'socialable_uuid'],
          },
        },
      ],
    });
  }

  findOne(where: WhereOptions<Business>) {
    return this.businessRepository.findOne({
      where,
    });
  }

  async create(payload: Required<CreateBusinessDTO>) {
    const transaction = await this.sequelize.transaction();
    try {
      const {
        instagram,
        whatsapp,
        telegram,
        twitter_x,
        status,
        manager,
        ...business
      } = payload;

      const newCafeRes = await this.businessRepository.create({
        ...business,
        status: status ? status : true,
      });

      const socials: Partial<Social>[] = Object.entries({
        instagram,
        whatsapp,
        telegram,
        twitter_x,
      })
        .filter(([, v]) => !!v)
        .map(([k, v]) => ({
          socialable_type: 'business',
          socialable_uuid: newCafeRes.uuid,
          type: k,
          link: v,
        }));
      await this.socialRepository.bulkCreate(socials);
      if (manager)
        await newCafeRes.addUser(manager, {
          through: { role: 'manager' },
        } as HasManyAddAssociationsMixinOptions);
      await transaction.commit();

      return newCafeRes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  remove(business_uuid: string) {
    return this.businessRepository.destroy({
      where: {
        uuid: business_uuid,
      },
    });
  }
  update(business_uuid: string, business: UpdateBusinessDTO) {
    return this.businessRepository.update(business, {
      where: {
        uuid: business_uuid,
      },
    });
  }

  async addUser(
    business_uuid: string,
    user_uuid: string,
    role?: 'manager' | 'employee',
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      let business: Business;
      if (this.request.user.role != 'admin') {
        const user = await this.userRepository.findOne({
          where: { uuid: this.request.user.uuid },
          include: [
            {
              model: Business,
              through: {
                where: {
                  role: 'manager',
                },
              },
              where: {
                uuid: business_uuid,
              },
            },
          ],
        });
        if (!user)
          throw new HttpException(
            "You don't have permission to perform this action!",
            HttpStatus.FORBIDDEN,
          );
        business = await user.businesses?.find(
          (item) => item.uuid == business_uuid,
        );
      } else {
        business = await this.businessRepository.findOne({
          where: {
            uuid: business_uuid,
          },
        });
      }
      if (!business)
        throw new HttpException(
          "Cafe restaurant not found or you dont' have enough permission!",
          HttpStatus.NOT_FOUND,
        );
      await business.addUser(user_uuid, {
        through: { role },
      } as HasManyAddAssociationsMixinOptions);
    } catch (error) {
      console.log({
        error,
      });
      transaction.rollback();
      throw error;
    }
  }
}
