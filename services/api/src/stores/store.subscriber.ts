import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SHOPKEEPER_DELETED, STORE_DELETED } from '../events/app.events';
import { StoreRepository } from './stores.repository';

export class StoreSubscriber {
  constructor(
    private eventEmitter: EventEmitter2,
    private storeRepository: StoreRepository,
  ) {}
  @OnEvent(SHOPKEEPER_DELETED)
  async handleShopkeeperDeletion(shopkeeperId: string) {
    const store = await this.storeRepository.storeModel
      .findOne({
        shopkeeper: shopkeeperId,
      })
      .exec();
    await this.storeRepository.storeModel
      .findOneAndDelete({
        shopkeeper: shopkeeperId,
      })
      .exec();
    this.eventEmitter.emit(STORE_DELETED, store._id, shopkeeperId);
  }
}
