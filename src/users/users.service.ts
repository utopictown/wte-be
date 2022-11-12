import { BadRequestException, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Role, User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  private response: { data: any; message: string } = { data: '', message: '' };

  async create(createUserDto: CreateUserDto, isStaff: boolean = false) {
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      const existedUser = await this.userModel.findOne({ username: createUserDto.username });

      if (existedUser)
        throw new BadRequestException({
          ...this.response,
          message: 'username already existed',
        });

      const user = new User();
      user.username = createUserDto.username;
      user.password = await bcrypt.hash(createUserDto.password, 10);

      if (isStaff) user.roles = Role.Staff;

      await this.userModel.create(user);
    });

    return { ...this.response, message: 'Successfully creating user' };
  }

  async findAll() {
    const result = await this.userModel.find().select('-password');

    return { ...this.response, data: result };
  }

  async findOne(identifier: string, withPassword: boolean = false) {
    let selected: { id: boolean; username: boolean; roles: boolean; password?: boolean } = {
      id: true,
      username: true,
      roles: true,
    };

    let result: User;

    if (withPassword) selected.password = true;

    try {
      result = await this.userModel.findOne({ _id: new mongoose.Types.ObjectId(identifier) }).select(selected);
    } catch (error) {
      result = await this.userModel.findOne({ username: identifier }).select(selected);
    }

    const request = RequestContext.currentContext.req;
    if (request.user && result.username != request.user.username)
      throw new UnauthorizedException('You dont have permission to access this resource');

    return { ...this.response, data: result };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const session = await this.connection.startSession();

    await session.withTransaction(async () => {
      await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto);
    });

    return { ...this.response, message: 'Successfully updating a user' };
  }

  remove(id: string) {
    this.userModel.deleteOne({ _id: id });

    return { ...this.response, message: 'Successfully deleting a user' };
  }
}
