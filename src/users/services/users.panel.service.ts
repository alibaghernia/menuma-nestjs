import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entites/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { QueryError, WhereOptions } from 'sequelize';
import { CreateUserDTO } from '../dto/create_user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '../dto/update_user.dto';
import { FiltersDTO, GetManagersFiltersDTO } from '../dto/filters.dto';
import { Op } from 'sequelize';
import { Business } from 'src/business/entites/business.entity';
import { Sequelize } from 'sequelize-typescript';
import { doInTransaction } from 'src/transaction';
import { BusinessUser } from 'src/business/entites/business_user.entity';
import { roles } from 'src/access_control/constants';

@Injectable()
export class UsersPanelService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Business) private businessRepository: typeof Business,
    @InjectModel(BusinessUser)
    private businessUserRepository: typeof BusinessUser,
    private sequelize: Sequelize,
  ) {}

  async fetchAll({ search = '', ...filters }: FiltersDTO) {
    const where: WhereOptions<User> = {
      [Op.or]: {
        first_name: {
          [Op.like]: `%${search}%`,
        },
        last_name: {
          [Op.like]: `%${search}%`,
        },
        mobile: {
          [Op.like]: `%${search}%`,
        },
      },
      role: {
        [Op.not]: 'admin',
      },
    };
    const offset = filters.page
      ? +filters.page * +filters.limit - +filters.limit
      : undefined;
    const limit = filters.page ? offset + +filters.limit : undefined;
    const users = await this.userRepository.findAll({
      where,
      offset,
      limit,
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Business,
          attributes: ['uuid', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    const count = await this.userRepository.count({
      where,
    });
    return [users, count];
  }

  fetchOne(where: WhereOptions<User>) {
    return this.userRepository.findOne({
      where,
    });
  }
  async get(user_uuid: string) {
    const user = await this.userRepository.findOne({
      where: { uuid: user_uuid },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Business,
          attributes: ['uuid', 'name'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    return user;
  }

  findByMobile(mobile: string) {
    return this.userRepository.findOne({
      where: {
        mobile,
      },
    });
  }

  async getAllManagers(filters: GetManagersFiltersDTO) {
    let users = await this.userRepository.findAll({
      where: {
        role: 'manager',
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Business,
          required: false,
          attributes: ['uuid'],
          through: {
            attributes: [],
          },
        },
      ],
      subQuery: false,
    });

    if (filters.no_business == 'true' || filters.no_business == '1') {
      users = users.filter((user) => user.businesses.length == 0);
    }

    return users;
  }

  async createUser(payload: CreateUserDTO) {
    try {
      const { password, business_uuid, ...userPayload } = payload;
      await doInTransaction(this.sequelize, async (transaction) => {
        if (
          business_uuid &&
          !(await this.businessRepository.count({
            where: { uuid: business_uuid },
          }))
        )
          throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

        const user = await this.userRepository.create(
          {
            password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
            ...userPayload,
          },
          { transaction },
        );
        if (business_uuid) {
          await user.setBusinesses([business_uuid], { transaction });
          const businessUser = await this.businessUserRepository.findOne({
            where: {
              business_uuid,
              user_uuid: user.uuid,
            },
          });
          if (user.role == 'manager') {
            await businessUser.addRole(roles.Business_Manager.uuid, {
              transaction,
            });
          } else {
            await businessUser.removeRole(roles.Business_Manager.uuid, {
              transaction,
            });
          }
        }
      });
    } catch (error) {
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  async updateUser(user_uuid: string, payload: UpdateUserDTO) {
    try {
      const { business_uuid, ...userPayload } = payload;
      return await doInTransaction(this.sequelize, async (transaction) => {
        if (
          business_uuid &&
          !(await this.businessRepository.count({
            where: { uuid: business_uuid },
          }))
        )
          throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

        const user = await this.userRepository.findOne({
          where: {
            uuid: user_uuid,
          },
        });
        if (!user)
          throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
        if (userPayload.password)
          userPayload.password = bcrypt.hashSync(
            userPayload.password,
            bcrypt.genSaltSync(),
          );
        user.update(userPayload, {
          transaction,
        });
        if (business_uuid) {
          if (!(await user.hasBusiness(business_uuid)))
            await user.setBusinesses([business_uuid], { transaction });
          const businessUser = await this.businessUserRepository.findOne({
            where: {
              business_uuid,
              user_uuid: user.uuid,
            },
          });
          if (user.role == 'manager') {
            await businessUser.addRole(roles.Business_Manager.uuid, {
              transaction,
            });
          } else {
            await businessUser.removeRole(roles.Business_Manager.uuid, {
              transaction,
            });
          }
        }
      });
    } catch (error) {
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  async deleteUser(user_uuid: string) {
    try {
      return await this.userRepository.destroy({
        where: {
          uuid: user_uuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
