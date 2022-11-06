import { Module } from '@nestjs/common';
import { WarrantyClaimsService } from './warranty-claims.service';
import { WarrantyClaimsController } from './warranty-claims.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarrantyClaim } from './entities/warranty-claim.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarrantyClaim, User, Product])],
  controllers: [WarrantyClaimsController],
  providers: [WarrantyClaimsService],
})
export class WarrantyClaimsModule {}
