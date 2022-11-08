import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { RequestContext } from 'nestjs-request-context';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateWarrantyClaimDto } from './dto/create-warranty-claim.dto';
import { UpdateWarrantyClaimDto } from './dto/update-warranty-claim.dto';
import { WarrantyClaim, WarrantyClaimDocument } from './schemas/warranty-claim.schema';

@Injectable()
export class WarrantyClaimsService {
  constructor(
    @InjectModel(WarrantyClaim.name) private warrantClaimModel: Model<WarrantyClaimDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createWarrantyDto: CreateWarrantyClaimDto) {
    const request = RequestContext.currentContext.req;

    const session = await this.connection.startSession();

    await session.withTransaction(async () => {
      const claimer = await this.userModel.findOne({
        _id: request.user.userId,
      });
      const product = await this.productModel.findOne({
        _id: createWarrantyDto.productId,
      });

      const warrantyClaim = new WarrantyClaim();
      warrantyClaim.description = createWarrantyDto.description;
      warrantyClaim.user = claimer;
      warrantyClaim.product = product;

      this.warrantClaimModel.create(warrantyClaim);
    });

    return { ...this.response, message: 'Successfully creating warranty claim' };
  }

  async findAll() {
    const result = await this.warrantClaimModel.find().populate('product').populate('user');

    return { ...this.response, data: result };
  }

  async findOne(id: string) {
    const result = await this.warrantClaimModel.findOne({ _id: id }).populate('product').populate('user');

    return { ...this.response, data: result };
  }

  async findAllMine() {
    const result = await this.warrantClaimModel
      .find({
        user: new mongoose.Types.ObjectId(RequestContext.currentContext.req.user.userId),
      })
      .populate('product')
      .populate('user');

    return { ...this.response, data: result };
  }

  async findOneMine(id: string) {
    const result = await this.warrantClaimModel
      .findOne({
        user: new mongoose.Types.ObjectId(RequestContext.currentContext.req.user.userId),
        _id: new mongoose.Types.ObjectId(id),
      })
      .populate('product')
      .populate('user');

    return { ...this.response, data: result };
  }

  async update(id: string, updateWarrantClaimDto: UpdateWarrantyClaimDto) {
    const session = await this.connection.startSession();

    await session.withTransaction(async () => {
      await this.warrantClaimModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, updateWarrantClaimDto);
    });

    return { ...this.response, message: 'Successfully updating a warranty claim' };
  }

  async remove(id: string) {
    await this.warrantClaimModel.deleteOne({ _id: id });

    return { ...this.response, message: 'Successfully deleting a warranty claim' };
  }
}
