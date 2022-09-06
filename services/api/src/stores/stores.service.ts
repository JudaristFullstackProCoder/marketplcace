import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    @Inject(StoreRepository) private storeRepository: StoreRepository,
  ) {}
  create(createCategoryDto: CreateStoreDto) {
    return this.storeRepository.addStore(createCategoryDto);
  }

  findAll() {
    return this.storeRepository.getAllStore();
  }

  findOne(id: string) {
    return this.storeRepository.getStoreItem(id);
  }

  find(filters: Record<string, unknown>) {
    return this.storeRepository.findStore(filters);
  }

  update(id: string, updateCategoryDto: UpdateStoreDto) {
    return this.storeRepository.updateStore(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.storeRepository.deleteStore(id);
  }

  addWys(storeId: string, wysId: never) {
    return this.storeRepository.addWys(storeId, wysId);
  }

  removeWys(storeId: string, wysId: never) {
    return this.storeRepository.removeWys(storeId, wysId);
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
        store instanceof InternalServerErrorException ||
        store instanceof NotFoundException
      ) {
        return store;
      }
      if (store.shopkeeper !== session.shopkeeper['_id']) {
        return new UnauthorizedException(
          'Sorry, you are not the owner of this resource',
        );
      }
      return true;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
