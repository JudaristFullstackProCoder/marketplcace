import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseApiController } from 'src/app.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectModel('users') public readonly userModel: Model<UserDocument>,
  ) {}
  async addUser(
    user: CreateUserDto,
  ): Promise<
    ResponseApiController<
      User | {},
      'can not created user' | 'user created successfully'
    >
  > {
    try {
      return {
        data: await new this.userModel(user).save(),
        status: 201,
        message: 'user created successfully',
      };
    } catch (e) {
      return {
        message: 'can not created user',
        status: 500,
        data: {},
      };
    }
  }
  async deleteUser(
    id: string,
  ): Promise<
    ResponseApiController<
      {},
      'user deleted successfully' | 'can not delete user'
    >
  > {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (deletedUser) {
        return {
          message: 'user deleted successfully',
          status: 200,
          data: {},
        };
      } else {
        return {
          message: 'can not delete user',
          status: 500,
          data: {},
        };
      }
    } catch (e) {
      return {
        message: 'can not delete user',
        status: 500,
        data: {
          error: e?.message,
        },
      };
    }
  }
  async updateUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<
    ResponseApiController<
      {},
      'user updated successfully' | 'can not update user'
    >
  > {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user);
      if (updatedUser) {
        return {
          message: 'user updated successfully',
          status: 200,
          data: {},
        };
      } else {
        return {
          message: 'can not update user',
          status: 500,
          data: {},
        };
      }
    } catch (e) {
      return {
        message: 'can not update user',
        status: 500,
        data: {
          error: e?.message,
        },
      };
    }
  }
  async getUserById(
    id: string,
  ): Promise<
    ResponseApiController<User | {}, 'not found' | 'internal server error' | ''>
  > {
    try {
      const user = await this.userModel.findById(id, '-password');
      if (!user) {
        return {
          message: 'not found',
          status: 404,
          data: {},
        };
      }
      return {
        data: user,
        status: 200,
        message: '',
      };
    } catch (e) {
      return {
        message: 'internal server error',
        status: 500,
        data: {
          error: e.message,
        },
      };
    }
  }

  async getAllUsers(): Promise<
    ResponseApiController<
      User[] | {},
      'not found' | 'internal server error' | ''
    >
  > {
    try {
      const users = await this.userModel.find();
      if (users) {
        return {
          data: users.map((e) => e),
          status: 200,
          message: '',
        };
      } else {
        return {
          message: 'not found',
          status: 404,
          data: {},
        };
      }
    } catch (e) {
      return {
        message: 'internal server error',
        status: 500,
        data: {
          error: e.message,
        },
      };
    }
  }

  async addSubscription(
    userId: string,
    storeId: string,
  ): Promise<
    ResponseApiController<
      {},
      | `user successfully suscribed to store`
      | 'internal server error'
      | 'user can not subscribe to store'
    >
  > {
    try {
      const addedUbscription = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $push: {
            subscriptions: storeId,
          },
        },
      );
      if (addedUbscription) {
        return {
          message: `user successfully suscribed to store`,
          status: 200,
          data: {},
        };
      } else {
        return {
          message: `user can not subscribe to store`,
          status: 400,
          data: {},
        };
      }
    } catch (e) {
      return {
        message: 'internal server error',
        status: 500,
        data: {
          error: e.message,
        },
      };
    }
  }

  async removeSubscription(
    userId: string,
    storeId: string,
  ): Promise<
    ResponseApiController<
      {},
      | 'user unsubscribe successfully from store'
      | 'user can not unsuscribe from store'
    >
  > {
    try {
      const removedSubscription = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $pull: {
            subscriptions: storeId,
          },
        },
      );
      if (removedSubscription) {
        return {
          data: {},
          message: 'user unsubscribe successfully from store',
          status: 200,
        };
      } else {
        return {
          data: {},
          message: 'user can not unsuscribe from store',
          status: 400,
        };
      }
    } catch (e) {
      return {
        data: {},
        message: 'user can not unsuscribe from store',
        status: 500,
      };
    }
  }

  getModel() {
    return this.userModel;
  }
}
