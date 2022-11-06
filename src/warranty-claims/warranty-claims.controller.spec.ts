import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyClaimsController } from './warranty-claims.controller';
import { WarrantyClaimsService } from './warranty-claims.service';

describe('WarrantyClaimsController', () => {
  let controller: WarrantyClaimsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarrantyClaimsController],
      providers: [WarrantyClaimsService],
    }).compile();

    controller = module.get<WarrantyClaimsController>(WarrantyClaimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
