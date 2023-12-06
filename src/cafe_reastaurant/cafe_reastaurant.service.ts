import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CafeReastaurant } from './entites/cafe_reastaurant.entity';
import { HasManyAddAssociationsMixinOptions, WhereOptions } from 'sequelize';
import { CreateCafeReastaurantDTO } from './dto';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';
import { UpdateCafeReastaurantDTO } from './dto/update.dto';
import { Op } from 'sequelize';

@Injectable()
export class CafeReastaurantService {
  private logger = new Logger(CafeReastaurantService.name);
  constructor(
    @InjectModel(CafeReastaurant)
    private cafeReastaurantRepository: typeof CafeReastaurant,
    @InjectModel(Social)
    private socialRepository: typeof Social,
    private sequelize: Sequelize,
  ) {}

  findAll() {
    this.logger.log('fetch all cafe-reastaurants');
    return this.cafeReastaurantRepository.findAll({
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
    return this.cafeReastaurantRepository.findOne({
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

  findOne(where: WhereOptions<CafeReastaurant>) {
    return this.cafeReastaurantRepository.findOne({
      where,
    });
  }

  async create(payload: Required<CreateCafeReastaurantDTO>) {
    const transaction = await this.sequelize.transaction();
    try {
      const {
        instagram,
        whatsapp,
        telegram,
        twitter_x,
        status,
        ...cafeReastaurant
      } = payload;

      const newCafeRes = await this.cafeReastaurantRepository.create({
        ...cafeReastaurant,
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
          socialable_type: 'cafe_reastaurant',
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

  remove(cafe_reastaurant_uuid: string) {
    return this.cafeReastaurantRepository.destroy({
      where: {
        uuid: cafe_reastaurant_uuid,
      },
    });
  }
  update(
    cafe_reastaurant_uuid: string,
    cafe_reastaurant: UpdateCafeReastaurantDTO,
  ) {
    return this.cafeReastaurantRepository.update(cafe_reastaurant, {
      where: {
        uuid: cafe_reastaurant_uuid,
      },
    });
  }

  async addUser(
    cafe_reastaurant_uuid: string,
    user_uuid: string,
    role?: 'manager' | 'employee',
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const cafe_reastaurant = await this.cafeReastaurantRepository.findOne({
        where: {
          uuid: cafe_reastaurant_uuid,
        },
      });
      if (!cafe_reastaurant)
        throw new HttpException(
          'Cafe reastaurant not found!',
          HttpStatus.NOT_FOUND,
        );
      await cafe_reastaurant.addUser(user_uuid, {
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
