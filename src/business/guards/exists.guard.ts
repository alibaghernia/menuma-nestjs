import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from '../entites/business.entity';

@Injectable()
export class CheckBusinessExistsGuard implements CanActivate {
  constructor(
    @InjectModel(Business)
    private businessRepository: typeof Business,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const business_uuid = request.params.business_uuid;

    const business = await this.businessRepository.findOne({
      where: {
        uuid: business_uuid,
      },
    });
    if (!business)
      throw new HttpException('Business not found!', HttpStatus.NOT_FOUND);
    return true;
  }
}
