import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHallDTO } from '../dto';
import { HallsFiltersDTO } from '../dto/filters.dto';
import { UpdateHallDTO } from '../dto/update.dto';
import { Op, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';
import { Sequelize } from 'sequelize-typescript';
import { BusinessHall } from '../entities/business_hall.entity';
import { getPagination } from 'src/utils/filter';

@Injectable()
export class HallPanelService {
  constructor(
    @InjectModel(BusinessHall)
    private businessHallRepository: typeof BusinessHall,
    @InjectModel(Business)
    private businessRepository: typeof Business,
    private sequelize: Sequelize,
  ) {}
  async getHalls(
    business_uuid: string,
    { code = '', ...filters }: HallsFiltersDTO,
  ) {
    const { offset, limit } = getPagination(filters);

    const where: WhereOptions<BusinessHall> = {
      business_uuid,
      code: {
        [Op.like]: `%${code}%`,
      },
    };

    const halls = await this.businessHallRepository.findAll({
      where,
      attributes: {
        exclude: ['business_uuid'],
      },
      limit,
      offset,
    });
    const count = await this.businessHallRepository.count({
      where: {
        business_uuid,
      },
    });
    return {
      halls,
      total: count,
    };
  }
  async getHall(business_uuid: string, hall_uuid: string) {
    const hall = await this.businessHallRepository.findOne({
      where: {
        business_uuid,
        uuid: hall_uuid,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    return hall;
  }
  async createHall(business_uuid: string, payload: CreateHallDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
      if (await business.hasHall({ code: payload.code }))
        throw new HttpException(
          {
            ok: false,
            code: 1,
            fields: ['code'],
            message: 'Hall is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await business.createHall(payload, {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async removeHall(hall_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.businessHallRepository.destroy({
        where: {
          uuid: hall_uuid,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async updateHall(
    business_uuid: string,
    hall_uuid: string,
    payload: UpdateHallDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (
        await this.businessHallRepository.count({
          where: {
            business_uuid,
            code: payload.code,
            [Op.not]: {
              uuid: hall_uuid,
            },
          },
        })
      )
        throw new HttpException(
          {
            ok: false,
            code: 4001,
            message: 'Hall is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await this.businessHallRepository.update(payload, {
        where: {
          uuid: hall_uuid,
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
