import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TablesFiltersDTO } from 'src/business/dto/filters.dto';
import { Business } from 'src/business/entites/business.entity';
import { CreateTableDTO } from '../dto';
import { UpdateTableDTO } from '../dto/update.dto';
import { BusinessTable } from '../entitile/business_tables.entity';
import { QrCode } from 'src/qr-code/enitites/qr-code.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TablePanelService {
  constructor(
    @InjectModel(BusinessTable)
    private businessTableRepository: typeof BusinessTable,
    @InjectModel(Business)
    private businessRepository: typeof Business,
    @InjectModel(QrCode)
    private qrCodeRepository: typeof QrCode,
    private configService: ConfigService,
    private sequelize: Sequelize,
  ) {}

  async getTables(
    business_uuid: string,
    { code = '', ...filters }: TablesFiltersDTO,
  ) {
    const offset = filters.page
      ? +filters.page * +filters.limit - +filters.limit
      : undefined;
    const limit = filters.page ? offset + +filters.limit : undefined;

    const where: WhereOptions<BusinessTable> = {
      business_uuid,
      code: {
        [Op.like]: `%${code}%`,
      },
    };
    const tables = await this.businessTableRepository.findAll({
      where,
      attributes: {
        exclude: ['business_uuid'],
      },
      limit,
      offset,
    });
    const count = await this.businessTableRepository.count({
      where: {
        business_uuid,
      },
    });
    return {
      tables: tables.map((table) => table.setImageUrl()),
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
    return table.setImageUrl();
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
            code: 1,
            fields: ['code'],
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
  async generateQRCode(business_uuid: string, table_uuid: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const business = await this.businessRepository.findOne({
        where: {
          uuid: business_uuid,
        },
        attributes: ['uuid', 'slug'],
        transaction,
      });
      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

      const hasDedicatedDomain = !!business.domain;
      const appDomain =
        this.configService.get('APP_DOMAIN') || 'http://127.0.0.1';

      const table = await this.businessTableRepository.findOne({
        where: {
          uuid: table_uuid,
        },
        attributes: ['uuid', 'code'],
        transaction,
      });
      if (!table)
        throw new HttpException('Table not found!', HttpStatus.NOT_FOUND);

      const qrCode_slug = `${business.slug}-tab-${table.uuid.substring(0, 5)}`;
      const qrCode_destination = hasDedicatedDomain
        ? `https://${business.domain}/menu`
        : `${appDomain}/${business.slug}/menu`;
      const where: WhereOptions<QrCode> = {
        business_uuid,
        [Op.or]: {
          slug: qrCode_slug,
          [Op.and]: {
            'metadata.destination': qrCode_destination,
            'metadata.queryParams.tab_id': table.code,
          },
        },
      };
      let qrCode = await this.qrCodeRepository.findOne({
        where,
      });
      if (!qrCode) {
        await this.qrCodeRepository.destroy({
          where: {
            slug: qrCode_slug,
          },
        });
        qrCode = await this.qrCodeRepository.create({
          business_uuid,
          slug: qrCode_slug,
          type: 'redirect',
          metadata: {
            destination: qrCode_destination,
            queryParams: {
              tab_id: table.code,
            },
          },
        });
      }
      await transaction.commit();
      return `${appDomain}/q/${qrCode.slug}`;
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
      if (!payload.hall_uuid) payload.hall_uuid = '';
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
