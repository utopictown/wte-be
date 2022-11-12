import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export enum ClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type WarrantyClaimDocument = HydratedDocument<WarrantyClaim>;

@Schema()
export class WarrantyClaim {
  @Prop({ type: String, enum: ClaimStatus, default: ClaimStatus.PENDING })
  status: ClaimStatus;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;
}

export const WarrantyClaimSchema = SchemaFactory.createForClass(WarrantyClaim);
