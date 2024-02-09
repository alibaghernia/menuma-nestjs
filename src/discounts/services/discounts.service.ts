import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Discount } from '../entities/discount.entity';
import { PublicFiltersDTO } from '../dto';
import { getPagination } from 'src/utils/filter';
import { FindOptions, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { Business } from 'src/business/entites/business.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount) private discountRepository: typeof Discount,
  ) {}

  async getAll({ search = '', ...filters }: PublicFiltersDTO) {
    const { offset, limit } = getPagination(filters);

    const where: WhereOptions<Discount> = {
      type: filters.type,
      title: {
        [Op.like]: `%${search}%`,
      },
    };
    const include: FindOptions<Discount>['include'] = [];
    if (filters.pin) where.pin = true;
    if (filters.business_uuid) where.business_uuid = filters.business_uuid;
    else {
      include.push({
        model: Business,
        where: {
          public: true,
        },
        attributes: {
          exclude: [
            'status',
            'location_lat',
            'location_long',
            'working_hours',
            'pager',
            'customer_club',
            'public',
            'pin',
          ],
        },
      });
    }
    const discounts = await this.discountRepository.findAll({
      where,
      offset,
      limit,
      include,
    });
    const count = await this.discountRepository.count({
      where,
    });

    return [discounts, count];
  }
  async get(uuid: string, business_uuid_slug: string) {
    const where: WhereOptions<Discount> = { uuid };
    const include: FindOptions<Discount>['include'] = [];
    if (business_uuid_slug)
      include.push({
        model: Business,
        attributes: [],
        where: {
          [Op.or]: {
            uuid: business_uuid_slug,
            slug: business_uuid_slug,
          },
        },
      });
    if (!business_uuid_slug) {
      include.push({
        model: Business,
        where: {
          public: true,
        },
        attributes: {
          exclude: [
            'status',
            'location_lat',
            'location_long',
            'working_hours',
            'pager',
            'customer_club',
            'public',
            'pin',
          ],
        },
      });
    }
    const discount = await this.discountRepository.findOne({
      where,
      include,
    });
    return discount;
  }
}
