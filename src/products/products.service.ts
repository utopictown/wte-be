import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = new Product();
      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.price = createProductDto.price;

      let slugged = slugify(createProductDto.name);
      const [productWithSameSlug, productWithSameSlugCount] = await this.productsRepository.findAndCountBy({ slug: slugged });
      if (productWithSameSlugCount > 0) slugged = slugify(`${createProductDto.name} ${productWithSameSlugCount + 1}`);
      product.slug = slugged;

      const staff = await this.usersRepository.findOneByOrFail({
        id: 'd32c36f4-4efc-4dfc-a3bc-ef91865f1b93',
      });
      product.creator = staff;

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new UnprocessableEntityException(error);
    } finally {
      await queryRunner.release();
    }

    return { ...this.response, message: 'Successfully creating product' };
  }

  async findAll() {
    const result = await this.productsRepository.find();

    return { ...this.response, data: result };
  }

  async findOne(id: number) {
    const result = await this.productsRepository.findOne({ where: { id } });

    return { ...this.response, data: result };
  }

  async update(id: number, updateUserDto: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Product, id, updateUserDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new UnprocessableEntityException(error);
    } finally {
      await queryRunner.release();
    }

    return { ...this.response, message: 'Successfully updating a product' };
  }

  remove(id: number) {
    this.productsRepository.delete(id);

    return { ...this.response, message: 'Successfully deleting a product' };
  }
}
