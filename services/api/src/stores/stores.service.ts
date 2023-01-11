import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    @Inject(StoreRepository) private storeRepository: StoreRepository,
  ) {}

  handleTryCatch (func: Function, args: Array<String|Record<string, unknown>|UpdateStoreDto> = []) {
    try {
      return {
        data: func(...args),
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

  create(createCategoryDto: CreateStoreDto) {
    try {
      return {
        data: this.storeRepository.addStore(createCategoryDto),
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

  findAll() {
    return this.handleTryCatch(this.storeRepository.getAllStore);
  }

  findOne(id: string) {
    return this.handleTryCatch(this.storeRepository.getStoreItem, [id]);
  }

  find(filters: Record<string, unknown>) {
    return this.handleTryCatch(this.storeRepository.findStore, [filters]);
  }

  update(id: string, updateCategoryDto: UpdateStoreDto) {
    return this.handleTryCatch(this.storeRepository.updateStore, [id, updateCategoryDto]);
  }

  remove(id: string) {
    return this.handleTryCatch(this.storeRepository.deleteStore, [id]);
  }

  addWys(storeId: string, wysId: never) {
    return this.handleTryCatch(this.storeRepository.addWys, [storeId, wysId]);
  }

  removeWys(storeId: string, wysId: never) {
    return this.handleTryCatch(this.storeRepository.removeWys, [storeId, wysId]);
  }

  async setOrReplaceFeaturedImage(
    storeId: string,
    image: Record<string, unknown>,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(storeId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.storeRepository.setOrReplaceFeaturedImage(storeId, image);
  }

  async checkOwnerShip(storeId: string, session: Record<string, unknown>) {
    try {
      const store = await this.storeRepository.getStoreItem(storeId);
      if (
        store.status !== 200
      ) {
        return store;
      }
      if (store.data?.shopkeeper !== session.shopkeeper['_id']) {
        return {
          message: 'Sorry, you are not the owner of this resource',
          status: 401,
          data: { error: "Unauthorised !"}
        }
      }
      return true;
    } catch (e) {
        return {
          message: e.message,
          status: 500,
          data: e,
        }
  }
}}
