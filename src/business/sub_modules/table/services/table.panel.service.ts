import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TablesFiltersDTO } from 'src/business/dto/filters.dto';
import { Business } from 'src/business/entites/business.entity';
import { BusinessTable } from 'src/business/entites/business_tables.entity';
import { CreateTableDTO } from '../dto';
import { UpdateTableDTO } from '../dto/update.dto';

@Injectable()
export class TablePanelService {
  constructor(
    @InjectModel(BusinessTable)
    private businessTableRepository: typeof BusinessTable,
    @InjectModel(Business)
    private businessRepository: typeof Business,
    private sequelize: Sequelize,
  ) {}

  async getTables(business_uuid: string, filters: TablesFiltersDTO) {
    const { page, limit, ...whereFilters } = filters;

    const tables = await this.businessTableRepository.findAll({
      where: {
        business_uuid,
        ...whereFilters,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
      limit: page * limit,
      offset: page * limit - limit,
    });
    const count = await this.businessTableRepository.count({
      where: {
        business_uuid,
      },
    });
    return {
      tables,
      total: count,
    };
  }
  async getTable(business_uuid: string, table_uuid: string) {
    const table = await this.businessTableRepository.findOne({
      where: {
        business_uuid,
        uuid: table_uuid,
      },
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    return table;
  }
  async createTable(business_uuid: string, payload: CreateTableDTO) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
      if (
        payload.hall_uuid &&
        !(await business.hasHall({ uuid: payload.hall_uuid }))
      )
        throw new HttpException('Hall not found!', HttpStatus.NOT_FOUND);
      if (await business.hasTable({ code: payload.code }))
        throw new HttpException(
          {
            ok: false,
            code: 4001,
            message: 'Table is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await business.createTable(payload, {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async removeTable(table_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.businessTableRepository.destroy({
        where: {
          uuid: table_uuid,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async updateTable(
    business_uuid: string,
    table_uuid: string,
    payload: UpdateTableDTO,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      if (
        await this.businessTableRepository.count({
          where: {
            business_uuid,
            code: payload.code,
            [Op.not]: {
              uuid: table_uuid,
            },
          },
        })
      )
        throw new HttpException(
          {
            ok: false,
            code: 4001,
            message: 'Table is already exists!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await this.businessTableRepository.update(payload, {
        where: {
          uuid: table_uuid,
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
