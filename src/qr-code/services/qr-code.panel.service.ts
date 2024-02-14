import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QrCode } from '../enitites/qr-code.entity';
import { CreateQrCodeDTO } from '../dto/create.dto';
import { QueryError } from 'sequelize';

@Injectable()
export class QrCodePanelService {
  constructor(@InjectModel(QrCode) private qrCodeRepo: typeof QrCode) {}

  async fetchAll(
    business_uuid: string,
    pagination: { page: number; limit: number },
  ) {
    const items = await this.qrCodeRepo.findAll({
      where: {
        business_uuid,
      },
      offset: pagination.page * pagination.limit - pagination.limit,
      limit: pagination.page * pagination.limit,
      attributes: {
        exclude: ['business_uuid'],
      },
    });
    const count = await this.qrCodeRepo.count({
      where: {
        business_uuid,
      },
    });

    return {
      qrCodes: items,
      total: count,
    };
  }
  async create(business_uuid: string, payload: CreateQrCodeDTO) {
    try {
      const qrCode = await this.qrCodeRepo.create({
        business_uuid,
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
  async update(qr_code_uuid: string, payload: CreateQrCodeDTO) {
    try {
      await this.qrCodeRepo.update(payload, {
        where: {
          uuid: qr_code_uuid,
        },
      });
    } catch (error) {
      if ((error as QueryError)?.name == 'SequelizeUniqueConstraintError') {
        // duplicate entry
        throw new HttpException(
          'Qr code slug or uuid is duplicate',
          HttpStatus.BAD_REQUEST,
        );
      }
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
