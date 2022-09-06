import { Test, TestingModule } from '@nestjs/testing';
import { VariationsController } from './variations.controller';
import { VariationsService } from './variations.service';

describe('VariationsController', () => {
  let controller: VariationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariationsController],
      providers: [VariationsService],
    }).compile();

    controller = module.get<VariationsController>(VariationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
