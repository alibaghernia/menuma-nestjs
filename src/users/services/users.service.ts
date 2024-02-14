import { Injectable } from '@nestjs/common';
import { User } from '../entites/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async getMe(uuid: string) {
    const user = await this.userRepository.findOne({
      where: {
        uuid,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Business,
          attributes: ['uuid', 'name', 'slug', 'logo', 'banner'],
          through: {
            where: {
              role: {
                [Op.or]: ['manager', 'employee'],
              },
            },
          },
        },
      ],
    });

    user.businesses?.forEach((bus) => bus.setImages());

    return user;
  }
}
