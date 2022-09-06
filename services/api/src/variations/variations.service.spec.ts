import { Test, TestingModule } from '@nestjs/testing';
import { VariationsService } from './variations.service';

describe('VariationsService', () => {
  let service: VariationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariationsService],
    }).compile();

    service = module.get<VariationsService>(VariationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
