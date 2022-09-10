import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UsersRepository from './users.repository';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@Inject(UsersRepository) private repository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }
    createUserDto['token'] = await bcrypt.hash(
      JSON.stringify(createUserDto) + new Date().toISOString(),
      10,
    );
    const response = this.repository.addUser(createUserDto);
    return response;
  }

  findAllUsers() {
    return this.repository.getAllUsers();
  }

  findOne(id: string) {
    return this.repository.getUserById(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(id, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.repository.updateUser(id, updateUserDto);
  }

  async remove(id: string, session: Record<string, unknown>) {
    const ownership = await this.checkOwnerShip(id, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.repository.deleteUser(id);
  }

  async addSubscription(
    userId: string,
    storeId: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(userId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.repository.addSubscription(userId, storeId);
  }

  async removeSubscription(
    userId: string,
    storeId: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(userId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.repository.removeSubscription(userId, storeId);
  }

  async checkOwnerShip(userId: string, session: Record<string, unknown>) {
    try {
      const product = await this.repository.getUserById(userId);
      if (product.status !== 200) {
        return {
          message: 'Sorry, you are not the owner of this resource',
          status: 500,
          data: {},
        };
      }
      if (
        product instanceof InternalServerErrorException ||
        product instanceof NotFoundException
      ) {
        return product;
      }
      if (userId !== session.user['_id']) {
        return {
          message: 'Sorry, you are not the owner of this resource',
          status: 401,
          data: {},
        };
      }
      return true;
    } catch (e) {
      return {
        message: 'Sorry, you are not the owner of this resource',
        status: 401,
        data: { ...e },
      };
    }
  }

  private async updateUserPermissions(
    userId: string,
    userNewPermissions: Record<string, unknown>,
    model: Model<string>,
  ) {
    try {
      const update = await model
        .findByIdAndUpdate(userId, {
          permissions: userNewPermissions,
        })
        .exec();
      return {
        message: 'operation performed successfully',
        status: 200,
        data: {},
      };
    } catch (e) {
      return {
        message: e.message,
        status: 500,
        data: { ...e },
      };
    }
  }

  async addUserPerms(userPerms: any, userId: string) {
    const user = await this.repository.getUserById(userId);
    if (user.status !== 200) {
      return user;
    }
    user.data.permissions[0][userPerms] = userPerms;
    return this.updateUserPermissions(
      userId,
      // @ts-ignore
      user.data.permissions,
      this.repository.getModel(),
    );
  }

  async removeUserPerms(userPerms: any, userId: string) {
    const user = await this.repository.getUserById(userId);
    if (user.status !== 200) {
      return user;
    }
    user.data.permissions[0][userPerms] = false;
    //@ts-ignore
    return this.updateUserPermissions(userId, user.data.permissions, model);
  }
}
