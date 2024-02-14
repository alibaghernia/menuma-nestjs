import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QrCode } from '../enitites/qr-code.entity';
import { CreateDTO } from '../dto/create.dto';
import { QueryError, WhereOptions } from 'sequelize';
import { GetAllDTO } from '../dto/retrieve.dto';
import { getPagination } from 'src/utils/filter';

@Injectable()
export class QrCodePanelService {
  constructor(@InjectModel(QrCode) private qrCodeRepo: typeof QrCode) {}

  async getAll(filters: GetAllDTO) {
    const { limit, offset } = getPagination(filters);
    const where: WhereOptions<QrCode> = {};
    if (filters.business_uuid) where.business_uuid = filters.business_uuid;
    const items = await this.qrCodeRepo.findAll({
      where,
      offset,
      limit,
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    const count = await this.qrCodeRepo.count({
      where,
    });

    return [items, count];
  }
  async get(uuid: string) {
    const where: WhereOptions<QrCode> = { uuid };
    const item = await this.qrCodeRepo.findOne({
      where,
      attributes: {
        exclude: ['business_uuid'],
      },
    });

    return item;
  }
  async getData(uuid: string) {
    const where: WhereOptions<QrCode> = { uuid };
    const item = await this.qrCodeRepo.findOne({
      where,
      attributes: {
        exclude: ['business_uuid'],
      },
    });

    return `https://q.menuma.online/${item.slug}`;
  }
  async create(payload: CreateDTO) {
    try {
      const qrCode = await this.qrCodeRepo.create({
        business_uuid: payload.business_uuid,
        ...payload,
      });
      return qrCode;
    } catch (error) {
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          {
            code: 1,
            message: `some fields are duplicate!`,
            fields: Object.keys(error.fields),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  async update(qr_code_uuid: string, payload: CreateDTO) {
    try {
      await this.qrCodeRepo.update(payload, {
        where: {
          uuid: qr_code_uuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async delete(qr_code_uuid: string) {
    try {
      await this.qrCodeRepo.destroy({
        where: {
          uuid: qr_code_uuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
