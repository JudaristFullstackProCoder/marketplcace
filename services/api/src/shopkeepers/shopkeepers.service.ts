import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateShopkeeperDto } from './dto/create-shopkeeper.dto';
import { ShopkeeperDocument } from './entities/shopkeeper.entity';
import { ShopkeeperRepository } from './shopkeeper.repository';

@Injectable()
export class ShopkeepersService {
  constructor(
    @Inject(ShopkeeperRepository) private repository: ShopkeeperRepository,
  ) {}

  create(createShopkeeperDto: CreateShopkeeperDto) {
    return this.repository.addShopkeeper(createShopkeeperDto);
  }

  findAll() {
    return this.repository.getAllShopkeepers();
  }

  findOne(id: string) {
    return this.repository.getShopkeeperById(id);
  }

  remove(id: string) {
    return this.repository.deleteShopkeeper(id);
  }

  private async updateShopkeeperPermissions(
    userId: string,
    userNewPermissions: Record<string, unknown>,
  ) {
    try {
      const update = await this.repository
        .getModel()
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

  async addShopkeeperPerms(userPerms: any, shopkeeperId: string) {
    const shopkeeper = await this.repository.getShopkeeperById(shopkeeperId);
    if (shopkeeper.status !== 200) {
      return shopkeeper;
    }
    shopkeeper.data.permissions[0][userPerms] = userPerms;
    return this.updateShopkeeperPermissions(
      shopkeeperId,
      // @ts-ignore
      shopkeeper.data.permissions,
    );
  }

  async removeShopkeeperPerms(userPerms: any, shopkeeperId: string) {
    const shopkeeper = await this.repository.getShopkeeperById(shopkeeperId);
    if (shopkeeper.status !== 200) {
      return shopkeeper;
    }
    shopkeeper.data.permissions[0][userPerms] = false;
    //@ts-ignore
    return this.updateShopkeeperPermissions(
      shopkeeperId,
      shopkeeper.data.permissions,
    );
  }
}
