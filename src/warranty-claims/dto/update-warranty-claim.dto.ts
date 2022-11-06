import { PartialType } from '@nestjs/mapped-types';
import { ClaimStatus } from '../entities/warranty-claim.entity';
import { CreateWarrantyClaimDto } from './create-warranty-claim.dto';

export class UpdateWarrantyClaimDto extends PartialType(CreateWarrantyClaimDto) {
  status: ClaimStatus;
}
