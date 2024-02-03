import { Injectable } from '@nestjs/common';
import { User } from '../entites/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  getMe(uuid: string) {
    return this.userRepository.findOne({
      where: {
        uuid,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Business,
          attributes: ['uuid', 'name', 'slug'],
          through: {
            attributes: [],
            where: {
              role: {
                [Op.or]: ['manager', 'employee'],
              },
            },
          },
        },
      ],
    });
  }
}
