import { Test, TestingModule } from '@nestjs/testing';
import { CafeRestaurantController } from './cafe_restaurant.controller';

describe('CafeRestaurantController', () => {
  let controller: CafeRestaurantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeRestaurantController],
    }).compile();

    controller = module.get<CafeRestaurantController>(CafeRestaurantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
