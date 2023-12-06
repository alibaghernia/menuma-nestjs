import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CafeRestaurant } from './entites/cafe_restaurant.entity';
import { HasManyAddAssociationsMixinOptions, WhereOptions } from 'sequelize';
import { CreateCafeRestaurantDTO } from './dto';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';
import { UpdateCafeRestaurantDTO } from './dto/update.dto';
import { Op } from 'sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entites/user.entity';

@Injectable()
export class CafeRestaurantService {
  private logger = new Logger(CafeRestaurantService.name);
  constructor(
    @InjectModel(CafeRestaurant)
    private cafeRestaurantRepository: typeof CafeRestaurant,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Social)
    private socialRepository: typeof Social,
    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
  ) {}

  findAll() {
    this.logger.log('fetch all cafe-restaurants');
    return this.cafeRestaurantRepository.findAll({
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
    return this.cafeRestaurantRepository.findOne({
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

  findOne(where: WhereOptions<CafeRestaurant>) {
    return this.cafeRestaurantRepository.findOne({
      where,
    });
  }

  async create(payload: Required<CreateCafeRestaurantDTO>) {
    const transaction = await this.sequelize.transaction();
    try {
      const {
        instagram,
        whatsapp,
        telegram,
        twitter_x,
        status,
        ...cafeRestaurant
      } = payload;

      const newCafeRes = await this.cafeRestaurantRepository.create({
        ...cafeRestaurant,
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
          socialable_type: 'cafe_restaurant',
          socialable_uuid: newCafeRes.uuid,
          type: k,
          link: v,
        }));
      await this.socialRepository.bulkCreate(socials);
      await transaction.commit();

      return newCafeRes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  remove(cafe_restaurant_uuid: string) {
    return this.cafeRestaurantRepository.destroy({
      where: {
        uuid: cafe_restaurant_uuid,
      },
    });
  }
  update(
    cafe_restaurant_uuid: string,
    cafe_restaurant: UpdateCafeRestaurantDTO,
  ) {
    return this.cafeRestaurantRepository.update(cafe_restaurant, {
      where: {
        uuid: cafe_restaurant_uuid,
      },
    });
  }

  async addUser(
    cafe_restaurant_uuid: string,
    user_uuid: string,
    role?: 'manager' | 'employee',
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const user = await this.userRepository.findOne({
        where: { uuid: this.request.user.uuid },
        include: [
          {
            model: CafeRestaurant,
            through: {
              where: {
                role: 'manager',
              },
            },
            where: {
              uuid: cafe_restaurant_uuid,
            },
          },
        ],
      });
      if (!user)
        throw new HttpException(
          "You don't have permission to perform this action!",
          HttpStatus.FORBIDDEN,
        );
      const cafe_restaurant = await user.cafeRestaurants?.find(
        (item) => item.uuid == cafe_restaurant_uuid,
      );
      if (!cafe_restaurant)
        throw new HttpException(
          "Cafe restaurant not found or you dont' have enough permission!",
          HttpStatus.NOT_FOUND,
        );
      await cafe_restaurant.addUser(user_uuid, {
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
