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

@Injectable()
export class ShopkeeperRepository {
  constructor(
    @InjectModel('shopkeepers')
    readonly shopkeeperModel: Model<ShopkeeperDocument>,
  ) {}
  async addShopkeeper(user: CreateShopkeeperDto) {
    try {
      const shopkeeper = await new this.shopkeeperModel(user).save();
      return {
        message: 'operation performed successfully',
        status: 200,
        data: { ...shopkeeper },
      };
    } catch (e) {
      return {
        message: e.message,
        status: 500,
        data: { ...e },
      };
    }
  }
  async deleteShopkeeper(id: string) {
    try {
      const deleted = await this.shopkeeperModel.findByIdAndDelete(id);
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
  async getShopkeeperById(id: string) {
    try {
      const shopkeeper = await this.shopkeeperModel.findById(id);
      if (!shopkeeper) {
        return {
          message: 'not found',
          status: 404,
          data: {},
        };
      }
      return {
        message: 'operation performed successfully',
        status: 200,
        data: { ...shopkeeper },
      };
    } catch (e) {
      return {
        message: e.message,
        status: 500,
        data: { ...e },
      };
    }
  }

  async getAllShopkeepers() {
    try {
      const result = await this.shopkeeperModel.find();
      return {
        message: 'operation performed successfully',
        status: 200,
        data: result,
      };
    } catch (e) {
      return {
        message: e.message,
        status: 500,
        data: { ...e },
      };
    }
  }

  getModel() {
    return this.shopkeeperModel;
  }
}
