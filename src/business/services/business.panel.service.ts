import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';
import { FindOptions, Op, QueryError, WhereOptions } from 'sequelize';
import { CreateBusinessDTO, CreateHallDTO, CreateTableDTO } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';
import {
  UpdateBusinessDTO,
  UpdateHallDTO,
  UpdatePagerRequestDTO,
  UpdateTableDTO,
} from '../dto/update.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entites/user.entity';
import { SetBusinessManagerDTO } from '../dto/set_business_manager';
import { BusinessUser } from '../entites/business_user.entity';
import { Business_Employee_role, roles } from 'src/access_control/constants';
import { BusinessUserRole } from 'src/access_control/entities/business-user_role.entity';
import { BusinessTable } from '../entites/business_tables.entity';
import {
  PanelBusinessesFiltersDTO,
  HallsFiltersDTO,
  PagerRequestsFiltersDTO,
  TablesFiltersDTO,
} from '../dto/filters.dto';
import { PagerRequest } from '../entites/pager_request.entity';
// import { Role } from 'src/access_control/entities/role.entity';
import { Hall } from '../entites/hall.entity';
import { PagerRequestgGateway } from '../gateways/pager_request.gateway';

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
    @InjectModel(Hall)
    private HallRepository: typeof Hall,
    @InjectModel(PagerRequest)
    private pagerRequestRepository: typeof PagerRequest,
    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
    private pagerRequestGateway: PagerRequestgGateway,
  ) {}

  async findAll({ name = '', ...filters }: PanelBusinessesFiltersDTO) {
    this.logger.log('fetch all businesses');

    const offset = filters.page
      ? +filters.page * +filters.limit - +filters.limit
      : undefined;
    const limit = filters.page ? offset + +filters.limit : undefined;

    const where = {
      name: {
        [Op.like]: `%${name}%`,
      },
    };

    const businesses = await this.businessRepository.findAll({
      where,
      include: [
        {
          model: Social,
        },
      ],
      limit,
      offset,
    });
    const count = await this.businessRepository.count({
      where,
    });

    return {
      businesses,
      total: count,
    };
  }

  async findBySlugOrId(slugOrId: string) {
    const business = (
      await this.businessRepository.findOne({
        where: {
          [Op.or]: {
            slug: slugOrId,
            uuid: slugOrId,
          },
        },
        include: [
          {
            model: Social,
            required: false,
            attributes: {
              exclude: ['uuid', 'socialable_type', 'socialable_uuid'],
            },
          },
          {
            model: User,
            required: false,
            attributes: ['uuid'],
            through: {
              attributes: ['role', 'uuid'],
            },
          },
        ],
      })
    )?.get({ plain: true });

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
        users,
        ...businessPayload
      } = payload;
      const business = await this.businessRepository.create(
        {
          ...businessPayload,
          status: status == 'active',
        },
        { transaction },
      );

      const socials: Partial<Social>[] = Object.entries({
        instagram,
        whatsapp,
        telegram,
        twitter_x,
      })
        .filter(([, v]) => !!v)
        .map(([k, v]) => ({
          socialable_type: 'business',
          socialable_uuid: business.uuid,
          type: k,
          link: v,
        }));
      await this.socialRepository.bulkCreate(socials, { transaction });
      if (users?.length) {
        const usersUUIDs = users.map((user) => user.user_uuid);
        await business.setUsers(usersUUIDs, {
          transaction,
        });
        const businessUsers = await this.businessUserRepository.findAll({
          where: {
            business_uuid: business.uuid,
            user_uuid: usersUUIDs,
          },
          transaction,
        });
        for (const businessUser of businessUsers) {
          const newRole = users.find(
            (bus) => bus.user_uuid == businessUser.user_uuid,
          )?.role;
          if (newRole && newRole != businessUser.role) {
            await businessUser.update({ role: newRole }, { transaction });
            if (newRole == 'manager') {
              await businessUser.setRoles([roles.Business_Manager.uuid], {
                transaction,
              });
            } else if (newRole == 'employee') {
              await businessUser.setRoles([Business_Employee_role.uuid], {
                transaction,
              });
            } else {
              await businessUser.setRoles([], { transaction });
            }
          }
        }
      }
      await transaction.commit();

      return business;
    } catch (error) {
      await transaction.rollback();
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            code: 1,
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
      const {
        instagram,
        telegram,
        whatsapp,
        twitter_x,
        status,
        users,
        ...businessProps
      } = _business;
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
      await business.update({
        ...businessProps,
        status: status == 'active',
      });
      if (users?.length) {
        const usersUUIDs = users.map((user) => user.user_uuid);
        await business.setUsers(usersUUIDs, {
          transaction,
        });
        const businessUsers = await this.businessUserRepository.findAll({
          where: {
            business_uuid,
            user_uuid: usersUUIDs,
          },
          transaction,
        });
        console.log({
          len: businessUsers.length,
        });
        for (const businessUser of businessUsers) {
          const newRole = users.find(
            (bus) => bus.user_uuid == businessUser.user_uuid,
          )?.role;
          console.log({
            newRole,
          });
          if (newRole && newRole != businessUser.role) {
            console.log({
              newRole,
            });
            await businessUser.update({ role: newRole }, { transaction });
            if (newRole == 'manager') {
              await businessUser.setRoles([roles.Business_Manager.uuid], {
                transaction,
              });
            } else if (newRole == 'employee') {
              await businessUser.setRoles([Business_Employee_role.uuid], {
                transaction,
              });
            } else {
              await businessUser.setRoles([], { transaction });
            }
          }
        }
      } else {
        await business.setUsers([]);
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            code: 1,
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
          {
            ok: false,
            code: 4001,
            message: 'Table is already exists!',
          },
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
  async removeTable(table_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.businessTableRepository.destroy({
        where: {
          uuid: table_uuid,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async updateTable(
    business_uuid: string,
    table_uuid: string,
    payload: UpdateTableDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (
        await this.businessTableRepository.count({
          where: {
            business_uuid,
            code: payload.code,
            [Op.not]: {
              uuid: table_uuid,
            },
          },
        })
      )
        throw new HttpException(
          {
            ok: false,
            code: 4001,
            message: 'Table is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
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

  async getHalls(business_uuid: string, filters: HallsFiltersDTO) {
    const { page, limit, ...whereFilters } = filters;

    const halls = await this.HallRepository.findAll({
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
    const count = await this.HallRepository.count({
      where: {
        business_uuid,
      },
    });
    return {
      halls,
      total: count,
    };
  }
  async createHall(business_uuid: string, payload: CreateHallDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
      if (await business.hasHall({ code: payload.code }))
        throw new HttpException(
          {
            ok: false,
            code: 401,
            message: 'Hall is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await this.HallRepository.create(
        { ...payload },
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

  async removeHall(hall_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.HallRepository.destroy({
        where: {
          uuid: hall_uuid,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateHall(
    business_uuid: string,
    hall_uuid: string,
    payload: UpdateHallDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (
        await this.HallRepository.count({
          where: {
            business_uuid,
            code: payload.code,
            [Op.not]: {
              uuid: hall_uuid,
            },
          },
        })
      )
        throw new HttpException(
          {
            ok: false,
            code: 401,
            message: 'Hall is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await this.HallRepository.update(payload, {
        where: {
          uuid: hall_uuid,
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPagerRequests(
    business_uuid: string,
    filters: PagerRequestsFiltersDTO,
  ) {
    const { table, page, limit, status } = filters;
    const whereFilters = Object.fromEntries(
      Object.entries({ status }).filter(([, v]) => !!v),
    );
    const queryObj: FindOptions<PagerRequest> = {
      where: {
        business_uuid,
        ...whereFilters,
      },
      include: [
        {
          model: BusinessTable,
          //@ts-ignore
          where: {
            code: {
              [Op.like]: `%${table || ''}%`,
            },
          },
        },
      ],
    };
    const requests = await this.pagerRequestRepository.findAll({
      ...queryObj,
      offset: page && limit ? page * limit - limit : undefined,
      limit: page && limit ? page * limit : undefined,
    });
    const total = await this.pagerRequestRepository.count(queryObj);
    return {
      requests,
      total,
    };
  }
  async getPagerRequest(business_uuid: string, request_uuid: string) {
    const request = await this.pagerRequestRepository.findOne({
      where: {
        business_uuid,
        uuid: request_uuid,
      },
      include: [
        {
          model: BusinessTable,
        },
      ],
    });
    return request;
  }
  async deletePagerRequest(request_uuid: string) {
    const request = await this.pagerRequestRepository.destroy({
      where: {
        uuid: request_uuid,
      },
    });
    return request;
  }
  async updatePagerRequest(
    business_uuid: string,
    request_uuid: string,
    payload: UpdatePagerRequestDTO,
  ) {
    await this.pagerRequestRepository.update(payload, {
      where: {
        uuid: request_uuid,
      },
    });
    await this.pagerRequestGateway.broadcastUpdatePagerNotification(
      business_uuid,
    );
  }
}
