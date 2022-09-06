import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SHOPKEEPER_DELETED, USER_DELETED } from '../events/app.events';
import { ShopkeeperRepository } from './shopkeeper.repository';

export class ShopkeeperSubscriber {
  constructor(
    private eventEmitter: EventEmitter2,
    private shopkeeperRepository: ShopkeeperRepository,
  ) {}
  @OnEvent(USER_DELETED)
  async handleUserDeleted(userId: string) {
    const shopkeeper = await this.shopkeeperRepository.shopkeeperModel.findOne({
      user: userId,
    });
    await this.shopkeeperRepository.shopkeeperModel
      .findOneAndDelete({
        user: userId,
      })
      .exec();
    this.eventEmitter.emit(SHOPKEEPER_DELETED, shopkeeper._id);
  }
}
