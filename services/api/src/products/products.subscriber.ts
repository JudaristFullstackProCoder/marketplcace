import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { STORE_DELETED } from '../events/app.events';
import { ProductRepository } from './product.repository';

export class ProductsSubscriber {
  constructor(
    private eventEmitter: EventEmitter2,
    private productRepository: ProductRepository,
  ) {}
  @OnEvent(STORE_DELETED)
  async handleStoreDeletion(storeId: string, shopkeeperId: string) {
    await this.productRepository.productModel
      .deleteMany({
        shopkeeper: shopkeeperId,
        store: storeId,
      })
      .exec();
  }
}
