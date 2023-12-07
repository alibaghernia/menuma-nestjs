import { Test, TestingModule } from '@nestjs/testing';
import { CafeRestaurantService } from './cafe_restaurant.service';

describe('CafeRestaurantService', () => {
  let service: CafeRestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CafeRestaurantService],
    }).compile();

    service = module.get<CafeRestaurantService>(CafeRestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
