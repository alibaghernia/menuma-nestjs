import { Test, TestingModule } from '@nestjs/testing';
import { CafeReastaurantController } from './cafe_reastaurant.controller';

describe('CafeReastaurantController', () => {
  let controller: CafeReastaurantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CafeReastaurantController],
    }).compile();

    controller = module.get<CafeReastaurantController>(
      CafeReastaurantController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
