import { Test, TestingModule } from '@nestjs/testing';
import { VerionController } from './verion.controller';

describe('VerionController', () => {
  let controller: VerionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerionController],
    }).compile();

    controller = module.get<VerionController>(VerionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
