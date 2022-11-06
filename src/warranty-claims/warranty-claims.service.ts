import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWarrantyClaimDto } from './dto/create-warranty-claim.dto';
import { UpdateWarrantyClaimDto } from './dto/update-warranty-claim.dto';
import { WarrantyClaim } from './entities/warranty-claim.entity';

@Injectable()
export class WarrantyClaimsService {
  constructor(
    @InjectRepository(WarrantyClaim)
    private warrantyClaimsRepository: Repository<WarrantyClaim>,
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createWarrantyDto: CreateWarrantyClaimDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const claimer = await this.usersRepository.findOneByOrFail({
        id: 'd32c36f4-4efc-4dfc-a3bc-ef91865f1b93',
      });
      const product = await this.productsRepository.findOneByOrFail({
        id: createWarrantyDto.productId,
      });

      const warrantyClaim = new WarrantyClaim();
      warrantyClaim.description = createWarrantyDto.description;
      warrantyClaim.user = claimer;
      warrantyClaim.product = product;

      await queryRunner.manager.save(warrantyClaim);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new UnprocessableEntityException(error);
    } finally {
      await queryRunner.release();
    }

    return { ...this.response, message: 'Successfully creating warranty claim' };
  }

  async findAll() {
    const result = await this.warrantyClaimsRepository.find();

    return { ...this.response, data: result };
  }

  async findOne(id: number) {
    const result = await this.warrantyClaimsRepository.findOne({ where: { id } });

    return { ...this.response, data: result };
  }

  async update(id: number, updateWarrantClaimDto: UpdateWarrantyClaimDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(WarrantyClaim, id, updateWarrantClaimDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new UnprocessableEntityException(error);
    } finally {
      await queryRunner.release();
    }

    return { ...this.response, message: 'Successfully updating a warranty claim' };
  }

  remove(id: number) {
    this.warrantyClaimsRepository.delete(id);

    return { ...this.response, message: 'Successfully deleting a warranty claim' };
  }
}
