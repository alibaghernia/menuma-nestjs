import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from 'src/business/entites/business.entity';
import { BusinessHall } from 'src/business/entites/business_hall.entity';

@Injectable()
export class HallService {
  constructor(
    @InjectModel(BusinessHall)
    private businessHallRepository: typeof BusinessHall,
    @InjectModel(Business)
    private businessRepository: typeof Business,
  ) {}

  async getHall(business_slug: string, hall_code: string) {
    try {
      const business = await this.businessRepository.findOne({
        where: {
          slug: business_slug,
        },
        attributes: ['uuid'],
      });

      if (!business)
        throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);

      const hall = await this.businessHallRepository.findOne({
        where: {
          business_uuid: business.uuid,
          code: hall_code,
        },
        attributes: {
          exclude: ['business_uuid'],
        },
      });
      if (!hall)
        throw new HttpException('Hall not found!', HttpStatus.NOT_FOUND);
      return hall;
    } catch (error) {
      throw error;
    }
  }
}
