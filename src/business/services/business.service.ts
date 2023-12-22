import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';
import { Sequelize } from 'sequelize-typescript';
import { Social } from 'src/database/entities/social.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entites/user.entity';
import { NewPagerRequestDTO } from '../dto';
import { PagerRequest } from '../entites/pager_request.entity';
import { STATUS } from '../constants/pager_request.cons';
import { PagerRequestgGateway } from '../gateways/pager_request.gateway';
import { BusinessTable } from '../entites/business_tables.entity';

@Injectable()
export class BusinessService {
  private logger = new Logger(BusinessService.name);
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Social)
    private socialRepository: typeof Social,
    @InjectModel(PagerRequest)
    private pagerRequestRepository: typeof PagerRequest,
    private sequelize: Sequelize,
    @Inject(REQUEST) private request: Request,
    private pagerRequestGateway: PagerRequestgGateway,
  ) {}

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
}
