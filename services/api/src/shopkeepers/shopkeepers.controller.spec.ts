import { Test, TestingModule } from '@nestjs/testing';
import { ShopkeepersController } from './shopkeepers.controller';
import { ShopkeepersService } from './shopkeepers.service';

describe('ShopkeepersController', () => {
  let controller: ShopkeepersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopkeepersController],
      providers: [ShopkeepersService],
    }).compile();

    controller = module.get<ShopkeepersController>(ShopkeepersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
