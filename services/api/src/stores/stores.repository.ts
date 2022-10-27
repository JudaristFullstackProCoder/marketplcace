import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModifyResult } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store, StoreDocument } from './entities/store.entity';
import { remove__v } from './stores.transformer';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectModel('stores') readonly storeModel: Model<StoreDocument>,
  ) {}

    async handleTryCatch (func: Function, args: Array<String|Record<string, unknown>|UpdateStoreDto> = []) {
    try {
      return {
        data: await func(...args),
        message: 'operation successfully executed',
        status: 500,
      }
    } catch (e) {
      return {
        data: e,
        message: e.message,
        status: 500,
      }
    }
  }

  async addStore(
    store: CreateStoreDto,
  ): Promise<Store | InternalServerErrorException> {
    try {
      return remove__v(await new this.storeModel(store).save());
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteStore(id: string) {
    return await this.handleTryCatch(this.storeModel.findByIdAndDelete, [id]);
  }
  async updateStore(id: string, store: UpdateStoreDto) {
    return await this.handleTryCatch(this.storeModel.findByIdAndUpdate, [id, store]);
  }
  async getStoreItem(
    id: string,
  ) {
    return await this.handleTryCatch(this.storeModel.findById, [id]);
  }
  async findStore(filters: Record<string, unknown>) {
    return this.handleTryCatch(this.storeModel.findOne, [filters]);
  }

  async getAllStore() {
    return await this.handleTryCatch(this.storeModel.find);
  }

  async setOrReplaceFeaturedImage(
    storeId: string,
    newImage: Record<string, unknown>,
  ) {
    try {
      return await this.storeModel
        .findByIdAndUpdate(storeId, {
          image: newImage,
        })
        .exec();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
    // return this.handleTryCatch(this.storeModel.findByIdAndUpdate, [storeId, {image: newImage,}]);
  }

  async addWys(
    storeId: string,
    domainId: never,
  ){
    return await this.handleTryCatch(this.storeModel.findOneAndUpdate, [{ _id: storeId,}, {$push: {wys: domainId,}}]);
  }

  async removeWys(
    storeId: string,
    domainId: never, // never to skip error i don't no for what
  ) {
    return await this.handleTryCatch(this.storeModel.findOneAndUpdate, [{ _id: storeId,}, {$pull: {wys: domainId,}}]);
  }
}
