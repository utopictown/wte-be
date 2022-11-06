import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyClaimsService } from './warranty-claims.service';

describe('WarrantyClaimsService', () => {
  let service: WarrantyClaimsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarrantyClaimsService],
    }).compile();

    service = module.get<WarrantyClaimsService>(WarrantyClaimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
