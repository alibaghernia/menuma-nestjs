import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CafeReastaurant } from './entites/cafe_reastaurant.entity';
import { WhereOptions } from 'sequelize';
import { CreateCafeReastaurantDTO } from './dto';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';

@Injectable()
export class CafeReastaurantService {
  constructor(
    @InjectModel(CafeReastaurant)
    private cafeReastaurantRepository: typeof CafeReastaurant,
    @InjectModel(Social)
    private socialRepository: typeof Social,
    private sequelize: Sequelize,
  ) {}

  findAll() {
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

  findBySlug(slug: string) {
    return this.cafeReastaurantRepository.findOne({
      where: {
        slug,
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
}
