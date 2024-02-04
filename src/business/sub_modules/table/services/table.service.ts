import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';
import { BusinessTable } from '../entitile/business_tables.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(BusinessTable)
    private businessTableRepository: typeof BusinessTable,
    @InjectModel(Business)
    private businessRepository: typeof Business,
  ) {}

  async getTable(business_slug: string, table_code: string) {
    try {
      const business = await this.businessRepository.findOne({
        where: {
          slug: business_slug,
        },
        attributes: ['uuid'],
      });

      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

      const table = await this.businessTableRepository.findOne({
        where: {
          business_uuid: business.uuid,
          code: table_code,
        },
        attributes: {
          exclude: ['business_uuid'],
        },
      });
      if (!table)
        throw new HttpException('Table not found!', HttpStatus.NOT_FOUND);
      return table.setImageUrl();
    } catch (error) {
      throw error;
    }
  }
}
