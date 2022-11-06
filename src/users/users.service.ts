import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existedUser = await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existedUser)
        return new BadRequestException({
          ...this.response,
          message: 'username already existed',
        });

      const user = new User();
      user.username = createUserDto.username;
      user.password = await bcrypt.hash(createUserDto.password, 10);

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new UnprocessableEntityException(error);
    } finally {
      await queryRunner.release();
    }

    return { ...this.response, message: 'Successfully creating user' };
  }

  async findAll() {
    const result = await this.usersRepository.find({
      select: ['id', 'username'],
    });

    return { ...this.response, data: result };
  }

  async findOne(id: string) {
    const result = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username'],
    });

    return { ...this.response, data: result };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, id, updateUserDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return new UnprocessableEntityException(error);
    } finally {
      await queryRunner.release();
    }

    return { ...this.response, message: 'Successfully updating a user' };
  }

  remove(id: string) {
    this.usersRepository.delete(id);

    return { ...this.response, message: 'Successfully deleting a user' };
  }
}
