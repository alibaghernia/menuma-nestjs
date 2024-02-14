import { Injectable } from '@nestjs/common';
import { CreateDTO, FiltersDTO, UpdateDTO } from '../dto';
import { InjectModel } from '@nestjs/sequelize';
import { Discount } from '../entities/discount.entity';
import { Sequelize } from 'sequelize-typescript';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { getPagination } from 'src/utils/filter';

@Injectable()
export class DiscountsPanelService {
  constructor(
    @InjectModel(Discount) private discountRepository: typeof Discount,
    private sequelize: Sequelize,
  ) {}

  async getAll(filters: FiltersDTO) {
    const { limit, offset } = getPagination(filters);
    const where: WhereOptions<Discount> = {
      title: {
        [Op.like]: `%${filters.search}%`,
      },
    };
    if (filters.business_uuid) where.business_uuid = filters.business_uuid;
    if (filters.type != 'ALL') {
      where.type = filters.type;
    }
    const items = await this.discountRepository.findAll({
      where,
      attributes: {
        exclude: ['business_uuid'],
      },
      limit,
      offset,
    });
    const count = await this.discountRepository.count({
      where,
    });
    return [items, count];
  }
  async get(uuid: string) {
    const item = await this.discountRepository.findOne({
      where: {
        uuid: uuid,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    return item;
  }
  async create(payload: CreateDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const discount = await this.discountRepository.create(payload, {
        transaction,
      });

      await transaction.commit();
      return discount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async remove(uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.discountRepository.destroy({
        where: {
          uuid: uuid,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async update(uuid: string, payload: UpdateDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.discountRepository.update(payload, {
        where: {
          uuid: uuid,
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
