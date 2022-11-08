import { Module } from '@nestjs/common';
import { WarrantyClaimsService } from './warranty-claims.service';
import { WarrantyClaimsController } from './warranty-claims.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { WarrantyClaim, WarrantyClaimSchema } from './schemas/warranty-claim.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WarrantyClaim.name, schema: WarrantyClaimSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [WarrantyClaimsController],
  providers: [WarrantyClaimsService],
})
export class WarrantyClaimsModule {}
