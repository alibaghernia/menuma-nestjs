import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';
import { Social } from 'src/database/entities/social.entity';
import { NewPagerRequestDTO } from '../dto';
import { PagerRequest } from '../entites/pager_request.entity';
import { STATUS } from '../constants/pager_request.cons';
import { PagerRequestgGateway } from '../gateways/pager_request.gateway';
import { BusinessTable } from '../entites/business_tables.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
    @InjectModel(PagerRequest)
    private pagerRequestRepository: typeof PagerRequest,
    @InjectModel(BusinessTable)
    private businessTableRepository: typeof BusinessTable,
    private pagerRequestGateway: PagerRequestgGateway,
  ) {}

  async getPublicBusinesses() {
    const businesses = await this.businessRepository.findAll({
      where: { public: true },
    });
    return businesses;
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
  async createPagerRequest(business_uuid: string, payload: NewPagerRequestDTO) {
    try {
      const request = await this.pagerRequestRepository.create({
        business_uuid,
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
  async cancelPagerRequest(business_uuid: string, request_uuid: string) {
    try {
      await this.pagerRequestRepository.destroy({
        where: {
          uuid: request_uuid,
        },
      });
      await this.pagerRequestGateway.broadcastCancelPagerNotification(
        business_uuid,
        request_uuid,
      );
    } catch (error) {
      throw error;
    }
  }
  async getTable(business_uuid: string, table_code: string) {
    try {
      const table = await this.businessTableRepository.findOne({
        where: {
          business_uuid,
          code: table_code,
        },
        attributes: {
          exclude: ['business_uuid'],
        },
      });
      if (!table)
        throw new HttpException('Table not found!', HttpStatus.NOT_FOUND);
      return table;
    } catch (error) {
      throw error;
    }
  }
}
