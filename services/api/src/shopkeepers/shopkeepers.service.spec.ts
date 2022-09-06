import { Test, TestingModule } from '@nestjs/testing';
import { ShopkeepersService } from './shopkeepers.service';

describe('ShopkeepersService', () => {
  let service: ShopkeepersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopkeepersService],
    }).compile();

    service = module.get<ShopkeepersService>(ShopkeepersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
