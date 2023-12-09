import { Test, TestingModule } from '@nestjs/testing';
import { BusinessPanelService } from './services/business.panel.service';

describe('BusinessService', () => {
  let service: BusinessPanelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessPanelService],
    }).compile();

    service = module.get<BusinessPanelService>(BusinessPanelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
