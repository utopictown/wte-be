import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import mongoose, { Connection, Model } from 'mongoose';
import { RequestContext } from 'nestjs-request-context';
import slugify from 'slugify';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createProductDto: CreateProductDto) {
    const session = await this.connection.startSession();

    const request = RequestContext.currentContext.req;

    await session.withTransaction(async () => {
      const product = new Product();
      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.price = createProductDto.price;

      let slugged = slugify(createProductDto.name);
      const productWithSameSlugCount = await this.productModel.findOne({ slug: slugged }).count();
      if (productWithSameSlugCount > 0) slugged = slugify(`${createProductDto.name} ${productWithSameSlugCount + 1}`);
      product.slug = slugged;

      const staff = await this.userModel.findOne({
        _id: request.user.userId,
      });
      product.creator = staff;
      this.productModel.create(product);
    });

    return { ...this.response, message: 'Successfully creating product' };
  }

  async findAll() {
    const result = await this.productModel.find().populate('creator');

    return { ...this.response, data: result };
  }

  async findOne(id: string) {
    const result = await this.productModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate('creator');

    return { ...this.response, data: result };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const session = await this.connection.startSession();

    await session.withTransaction(async () => {
      await this.productModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, updateProductDto);
    });

    return { ...this.response, message: 'Successfully updating a product' };
  }

  async remove(id: string) {
    await this.productModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    return { ...this.response, message: 'Successfully deleting a product' };
  }
}
