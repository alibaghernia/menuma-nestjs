import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';
import { Social } from 'src/database/entities/social.entity';
import { NewPagerRequestDTO } from '../dto';
import { PagerRequest } from '../entites/pager_request.entity';
import { STATUS } from '../constants/pager_request.cons';
import { PagerRequestgGateway } from '../gateways/pager_request.gateway';
import { BusinessTable } from '../sub_modules/table/entitile/business_tables.entity';
import { BusinessesFiltersDTO } from '../dto/filters.dto';
import { FindAttributeOptions, FindOptions, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Category } from 'src/category/entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { BusinessCategory } from '../entites/business_category.entity';
import { File } from 'src/files/entities/file.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
    @InjectModel(PagerRequest)
    private pagerRequestRepository: typeof PagerRequest,
    @InjectModel(BusinessCategory)
    private businessCategoryRepository: typeof BusinessCategory,
    private pagerRequestGateway: PagerRequestgGateway,
    private sequelize: Sequelize,
  ) {}

  async getBusinesses({ search = '', ...filters }: BusinessesFiltersDTO) {
    const where: WhereOptions<Business> = {
      public: true,
      [Op.or]: {
        name: {
          [Op.like]: `%${search}%`,
        },
        address: {
          [Op.like]: `%${search}%`,
        },
        description: {
          [Op.like]: `%${search}%`,
        },
        slug: {
          [Op.like]: `%${search}%`,
        },
      },
    };
    if (filters.pin) {
      // @ts-ignore
      where.pin = true;
    }
    const offset =
      filters.page && !filters.distance
        ? +filters.page * +filters.limit - +filters.limit
        : undefined;
    const limit =
      filters.page && !filters.distance ? offset + +filters.limit : undefined;

    const nearestQuery = `(
      floor((6371 * acos(
        cos(radians(${filters.location_lat}))
        * cos(radians(location_lat))
        * cos(radians(location_long) - radians(${filters.location_long}))
        + sin(radians(${filters.location_lat})) * sin(radians(location_lat))) * 1000)
    )
    )`;
    let having: FindOptions<Business>['having'];
    let order: FindOptions<Business>['order'];
    const attributes: FindAttributeOptions = {
      include: ['uuid'],
      exclude: ['uuid', 'socialable_type', 'socialable_uuid'],
    };

    if (filters.distance) {
      attributes.include = [
        'uuid',
        [this.sequelize.literal(nearestQuery), 'distance'],
      ];
      order = this.sequelize.col('distance');
      having = this.sequelize.literal(
        `distance <= ${+filters.distance} && distance > 0`,
      );
    }
    const businesses = await this.businessRepository.findAll({
      attributes,
      where,
      offset,
      limit,
      order,
      having,
    });
    const total = await this.businessRepository.count({
      attributes,
      where,
    });
    return [businesses, !filters.distance ? total : businesses.length];
  }

  async findBySlug(slug: string) {
    const business = await this.businessRepository.findOne({
      where: {
        slug: slug,
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

    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

    return business;
  }
  async getMenu(slug: string) {
    const business = await this.businessRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

    const businessCategories = await this.businessCategoryRepository.findAll({
      where: {
        business_uuid: business.uuid,
      },
      include: [
        {
          model: Category,
        },
        {
          model: Product,
          through: {
            attributes: [],
          },
          include: [
            {
              model: File,
              attributes: ['uuid'],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    return businessCategories.map((bc) => {
      return {
        ...bc.getDataValue('category').setImageUrl().toJSON(),
        products: bc
          .getDataValue('products')
          .map((prod) => prod.setImagesUrls()),
      };
    });
  }
  async createPagerRequest(business_slug: string, payload: NewPagerRequestDTO) {
    try {
      const business = await this.businessRepository.findOne({
        where: {
          slug: business_slug,
        },
        attributes: ['uuid'],
      });

      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

      const request = await this.pagerRequestRepository.create({
        business_uuid: business.uuid,
        table_uuid: payload.table_uuid,
        status: STATUS.todo,
      });
      await request.reload({
        include: [
          {
            model: BusinessTable,
          },
        ],
      });
      await this.pagerRequestGateway.broadcastPagerNotification(request);
      return request;
    } catch (error) {
      throw error;
    }
  }
  async cancelPagerRequest(business_slug: string, request_uuid: string) {
    try {
      const business = await this.businessRepository.findOne({
        where: {
          slug: business_slug,
        },
        attributes: ['uuid'],
      });

      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

      await this.pagerRequestRepository.destroy({
        where: {
          uuid: request_uuid,
        },
      });
      await this.pagerRequestGateway.broadcastCancelPagerNotification(
        business.uuid,
        request_uuid,
      );
    } catch (error) {
      throw error;
    }
  }
}
