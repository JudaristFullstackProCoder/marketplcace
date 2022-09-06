import { OnEvent } from '@nestjs/event-emitter';
import { STORE_DELETED } from '../events/app.events';
import { VariationRepository } from './variation.repository';

export default class VariationSubscriber {
  constructor(private variationRepository: VariationRepository) {}
  @OnEvent(STORE_DELETED)
  async handleStoreDeletionByDeletingAllProductVariations(
    storeId: string,
    shopkeeperId: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.variationRepository.variationsModel
      .deleteMany({
        shopkeeper: shopkeeperId,
      })
      .exec();
  }
}
