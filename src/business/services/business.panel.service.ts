import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';
import { HasManyAddAssociationsMixinOptions, WhereOptions } from 'sequelize';
import { CreateBusinessDTO, CreateTableDTO } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';
import { UpdateBusinessDTO, UpdateTableDTO } from '../dto/update.dto';
import { Op } from 'sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entites/user.entity';
import { SetBusinessManagerDTO } from '../dto/set_business_manager';
import { BusinessUser } from '../entites/business_user.entity';
import { roles } from 'src/access_control/constants';
import { BusinessUserRole } from 'src/access_control/entities/business-user_role.entity';
import { BusinessTable } from '../entites/business_tables.entity';
import { TablesFiltersDTO } from '../dto/filters.dto';

@Injectable()
export class BusinessPanelService {
  private logger = new Logger(BusinessPanelService.name);
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Social)
    private socialRepository: typeof Social,
    @InjectModel(BusinessUser)
    private businessUserRepository: typeof BusinessUser,
    @InjectModel(BusinessTable)
    private businessTableRepository: typeof BusinessTable,
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

  async findBySlugOrId(slugOrId: string) {
    const business = await this.businessRepository.findOne({
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

    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

    return business;
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
  async update(business_uuid: string, _business: UpdateBusinessDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });

      if (!business)
        throw new HttpException('Business Not found!', HttpStatus.NOT_FOUND);
      const { instagram, telegram, whatsapp, twitter_x, ...businessProps } =
        _business;
      const socials = Object.entries({
        instagram,
        telegram,
        whatsapp,
        twitter_x,
      }).filter(([, v]) => !!v);
      for (const [socialName, socialLink] of socials) {
        const social = await this.socialRepository.findOne({
          where: {
            socialable_type: 'business',
            socialable_uuid: business.uuid,
            type: socialName,
          },
        });
        if (social) {
          if (social.link != socialLink)
            await social.update({
              link: socialLink,
            });
        } else
          await business.createSocial({
            type: socialName,
            link: socialLink,
          });
      }
      await business.update(businessProps);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async addUser(business_uuid: string, user_uuid: string) {
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
          "Business not found or you dont' have enough permission!",
          HttpStatus.NOT_FOUND,
        );
      if (await business.hasUser(user_uuid))
        throw new HttpException(
          'this user is already registered in this business!',
          HttpStatus.BAD_REQUEST,
        );
      await business.addUser(user_uuid);
    } catch (error) {
      console.log({
        error,
      });
      transaction.rollback();
      throw error;
    }
  }
  async setBusinessManager(
    business_uuid: string,
    payload: SetBusinessManagerDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = this.userRepository.findOne({
        where: {
          uuid: payload.user_uuid,
        },
      });
      if (!user)
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

      const currentManager = await this.businessUserRepository.findOne({
        where: {
          business_uuid,
        },
        include: [
          {
            model: BusinessUserRole,
            where: {
              role_uuid: roles.Business_Manager.uuid,
            },
          },
        ],
      });
      if (currentManager)
        await currentManager.removeRole(roles.Business_Manager.uuid);

      const newBusinessManager = await this.businessUserRepository.findOne({
        where: {
          business_uuid,
          user_uuid: payload.user_uuid,
        },
      });
      if (!newBusinessManager)
        throw new HttpException(
          "This user isn't registered in this business!",
          HttpStatus.BAD_REQUEST,
        );
      await newBusinessManager.addRole(roles.Business_Manager.uuid);

      await transaction.commit();
    } catch (error) {
      console.log({
        error,
      });
      await transaction.rollback();
      throw error;
    }
  }
  async getTables(business_uuid: string, filters: TablesFiltersDTO) {
    const { page, limit, ...whereFilters } = filters;

    const tables = await this.businessTableRepository.findAll({
      where: {
        business_uuid,
        ...whereFilters,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
      limit: page * limit,
      offset: page * limit - limit,
    });
    const count = await this.businessTableRepository.count({
      where: {
        business_uuid,
      },
    });
    return {
      tables,
      total: count,
    };
  }
  async getTable(business_uuid: string, table_uuid: string) {
    const table = await this.businessTableRepository.findOne({
      where: {
        business_uuid,
        uuid: table_uuid,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    return table;
  }
  async createTable(business_uuid: string, payload: CreateTableDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
      if (await business.hasTable({ code: payload.code }))
        throw new HttpException(
          'Table is already exists!',
          HttpStatus.BAD_REQUEST,
        );
      await business.createTable(
        {
          code: payload.code,
        },
        {
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async removeTable(business_uuid: string, table_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

      await business.removeTable(table_uuid, {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async updateTable(table_uuid: string, payload: UpdateTableDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.businessTableRepository.update(payload, {
        where: {
          uuid: table_uuid,
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
