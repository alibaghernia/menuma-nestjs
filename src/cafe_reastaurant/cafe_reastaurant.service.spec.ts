import { Test, TestingModule } from '@nestjs/testing';
import { CafeReastaurantService } from './cafe_reastaurant.service';

describe('CafeReastaurantService', () => {
  let service: CafeReastaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CafeReastaurantService],
    }).compile();

    service = module.get<CafeReastaurantService>(CafeReastaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
