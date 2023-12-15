import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entites/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { QueryError, WhereOptions } from 'sequelize';
import { CreateUserDTO } from '../dto/create_user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '../dto/update_user.dto';

@Injectable()
export class UsersPanelService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  fetchAll() {
    return this.userRepository.findAll();
  }

  fetchOne(where: WhereOptions<User>) {
    return this.userRepository.findOne({
      where,
    });
  }

  findByMobile(mobile: string) {
    return this.userRepository.findOne({
      where: {
        mobile,
      },
    });
  }

  getAllManagers() {
    return this.userRepository.findOne({
      where: {
        role: 'manager',
      },
    });
  }

  async createUser(payload: CreateUserDTO) {
    try {
      const { password, ...user } = payload;
      return await this.userRepository.create({
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
        ...user,
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
      if (payload.password)
        payload.password = bcrypt.hashSync(
          payload.password,
          bcrypt.genSaltSync(),
        );
      return await this.userRepository.update(payload, {
        where: {
          uuid: user_uuid,
        },
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
