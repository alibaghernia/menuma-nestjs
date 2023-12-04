import { Injectable } from '@nestjs/common';
import { User } from './entites/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';

@Injectable()
export class UsersService {
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
}
