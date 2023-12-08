import { Test, TestingModule } from '@nestjs/testing';
import { ProductPanelService } from './services/product.panel.service';

describe('ProductService', () => {
  let service: ProductPanelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPanelService],
    }).compile();

    service = module.get<ProductPanelService>(ProductPanelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
