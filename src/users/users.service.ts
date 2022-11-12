import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RequestContext } from 'nestjs-request-context';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createUserDto: CreateUserDto) {
    const existedUser = await this.usersRepository.findOne({ where: { username: createUserDto.username } });

    if (existedUser)
      throw new BadRequestException({
        ...this.response,
        message: 'username already existed',
      });

    this.dataSource.transaction(async (manager) => {
      const user = new User();
      user.username = createUserDto.username;
      user.password = await bcrypt.hash(createUserDto.password, 10);

      manager.save(user);
    });

    return { ...this.response, message: 'Successfully creating user' };
  }

  async findAll() {
    const result = await this.usersRepository.find({ select: { password: false } });

    return { ...this.response, data: result };
  }

  async findOne(identifier: string, withPassword: boolean = false) {
    let selected: { id: boolean; username: boolean; password?: boolean } = {
      id: true,
      username: true,
    };

    let result: User;

    if (withPassword) selected.password = true;

    try {
      result = await this.usersRepository.findOneOrFail({ where: { id: Number(identifier) }, select: selected });
    } catch (error) {
      result = await this.usersRepository.findOne({ where: { username: identifier }, select: selected });
    }

    const request = RequestContext.currentContext.req;
    if (request.user && result.username != request.user.username)
      throw new UnauthorizedException('You dont have permission to access this resource');

    return { ...this.response, data: result };
  }
}
