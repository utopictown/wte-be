import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// placed based on hierarchy order, the higher the more superior
export enum Role {
  Staff = 'staff',
  Customer = 'customer',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.Customer })
  roles: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
