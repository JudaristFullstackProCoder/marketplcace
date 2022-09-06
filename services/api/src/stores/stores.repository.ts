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
    try {
      return (
        (await this.storeModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateStore(id: string, store: UpdateStoreDto) {
    try {
      return (
        (await this.storeModel.findByIdAndUpdate(id, store)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getStoreItem(
    id: string,
  ): Promise<StoreDocument | InternalServerErrorException | NotFoundException> {
    try {
      const store = await this.storeModel.findById(id);
      if (!(store instanceof BadRequestException)) {
        if (!store) {
          return new NotFoundException();
        }
      }
      return remove__v(store);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async findStore(filters: Record<string, unknown>) {
    try {
      const store = await this.storeModel.findOne(filters);
      if (!store) {
        return new NotFoundException();
      }
      return remove__v(store);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getAllStore(): Promise<
    NotFoundException | InternalServerErrorException | StoreDocument[]
  > {
    try {
      return (await this.storeModel.find()).map((store) => remove__v(store));
    } catch (e) {
      return new InternalServerErrorException(e);
    }
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
  }

  async addWys(
    storeId: string,
    domainId: never,
  ): Promise<InternalServerErrorException | ModifyResult<StoreDocument>> {
    try {
      return (
        (await this.storeModel.findOneAndUpdate(
          {
            _id: storeId,
          },
          {
            $push: {
              wys: domainId,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeWys(
    storeId: string,
    domainId: never, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<StoreDocument>> {
    try {
      return (
        (await this.storeModel.findOneAndUpdate(
          {
            _id: storeId,
          },
          {
            $pull: {
              wys: domainId,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
