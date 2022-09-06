import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShopkeeperDto } from './dto/create-shopkeeper.dto';
import { Shopkeeper, ShopkeeperDocument } from './entities/shopkeeper.entity';
import { remove__v_shopkeeper } from './shopkeeper.transformer';

@Injectable()
export class ShopkeeperRepository {
  constructor(
    @InjectModel('shopkeepers')
    readonly shopkeeperModel: Model<ShopkeeperDocument>,
  ) {}
  async addShopkeeper(
    user: CreateShopkeeperDto,
  ): Promise<Shopkeeper | InternalServerErrorException> {
    try {
      return await new this.shopkeeperModel(user).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteShopkeeper(id: string) {
    try {
      return (
        (await this.shopkeeperModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getShopkeeperItem(
    id: string,
  ): Promise<
    ShopkeeperDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const user = await this.shopkeeperModel.findById(id);
      if (!(user instanceof BadRequestException)) {
        if (!user) {
          return new NotFoundException();
        }
      }
      return remove__v_shopkeeper(user);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getAllShopkeepers(): Promise<
    NotFoundException | InternalServerErrorException | ShopkeeperDocument[]
  > {
    try {
      return (await this.shopkeeperModel.find()).map((e) =>
        remove__v_shopkeeper(e),
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  getModel() {
    return this.shopkeeperModel;
  }
}
