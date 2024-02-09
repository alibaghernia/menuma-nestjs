import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';
import { Op } from 'sequelize';

@Injectable()
export class CheckBusinessExistsGuard implements CanActivate {
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const business_uuid = (
      (request.params.business_uuid as string) || ''
    ).replace(':business_uuid', '');
    const business_slug = (
      (request.params.business_slug as string) || ''
    ).replace(':business_slug', '');
    if (!business_slug && !business_uuid)
      throw new HttpException(
        'You must provide business uuid or business slug based on your action!',
        HttpStatus.BAD_REQUEST,
      );

    const business = await this.businessRepository.findOne({
      where: {
        [Op.or]: {
          uuid: business_uuid,
          slug: business_slug,
        },
      },
    });
    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
    request.business_guard = { uuid: business.uuid };
    return true;
  }
}
