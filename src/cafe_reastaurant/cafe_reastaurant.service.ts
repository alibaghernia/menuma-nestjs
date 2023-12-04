import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CafeReastaurant } from './entites/cafe_reastaurant.entity';
import { WhereOptions } from 'sequelize';

@Injectable()
export class CafeReastaurantService {
  constructor(
    @InjectModel(CafeReastaurant)
    private cafeReastaurantRepository: typeof CafeReastaurant,
  ) {}

  findAll() {
    return this.cafeReastaurantRepository.findAll();
  }

  findOne(where: WhereOptions<CafeReastaurant>) {
    return this.cafeReastaurantRepository.findOne({
      where,
    });
  }

  create(payload: CafeReastaurant) {
    return this.cafeReastaurantRepository.create({
      ...payload,
      status: payload.status || true,
    });
  }
}
