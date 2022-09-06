import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../../users/entities/user.entity';

@Injectable()
export class PermissionsService {
  private async getUser(userId: string): Promise<UserDocument> {
    const user = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'GET',
    });
    return await user.json();
  }

  private async updateUserPermissions(
    userId: string,
    userNewPermissions: UserDocument['permissions'],
    model: Model<string>,
  ) {
    return await model
      .findByIdAndUpdate(userId, {
        permissions: userNewPermissions,
      })
      .exec();
  }

  async addUserPerms(userPerms: any, userId: string, model: Model<string>) {
    if (userPerms instanceof BadRequestException) return userPerms;
    try {
      const user = await this.getUser(userId);
      user.permissions[0][userPerms] = userPerms;
      return this.updateUserPermissions(userId, user.permissions, model);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeUserPerms(userPerms: any, userId: string, model: Model<string>) {
    if (userPerms instanceof BadRequestException) return userPerms;
    try {
      const user = await this.getUser(userId);
      user.permissions[0][userPerms] = false;
      return this.updateUserPermissions(userId, user.permissions, model);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addShopkeeperPerms(
    userPerms: any,
    userId: string,
    model: Model<string>,
  ) {
    return this.addUserPerms(userPerms, userId, model);
  }

  async removeShopkeeperPerms(
    userPerms: any,
    userId: string,
    model: Model<string>,
  ) {
    this.removeUserPerms(userPerms, userId, model);
  }
}
