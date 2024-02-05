import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { BusinessUser } from 'src/business/entites/business_user.entity';

@Injectable()
export class CheckBusinessAccessGuard implements CanActivate {
  constructor(
    @InjectModel(BusinessUser)
    private businessUserRepository: typeof BusinessUser,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.user.role == 'admin') return true; // if user is admin prevent checking permissions
    const user_uuid = request.user.uuid;
    const business_uuid = request.params.business_uuid;

    if (!business_uuid || business_uuid == ':business_uuid')
      throw new HttpException(
        "Business hasn't specified!",
        HttpStatus.FORBIDDEN,
      );

    const bussUser = await this.businessUserRepository.findOne({
      where: {
        business_uuid,
        user_uuid,
      },
    });
    if (!bussUser)
      throw new HttpException(
        "You don't have permission to this business!",
        HttpStatus.FORBIDDEN,
      );

    return true;
  }
}
