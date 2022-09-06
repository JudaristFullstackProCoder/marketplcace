import { Inject, Injectable } from '@nestjs/common';
import { CreateShopkeeperDto } from './dto/create-shopkeeper.dto';
import { ShopkeeperRepository } from './shopkeeper.repository';

@Injectable()
export class ShopkeepersService {
  constructor(
    @Inject(ShopkeeperRepository) private repository: ShopkeeperRepository,
  ) {}

  create(createShopkeeperDto: CreateShopkeeperDto) {
    return this.repository.addShopkeeper(createShopkeeperDto);
  }

  findAll() {
    return this.repository.getAllShopkeepers();
  }

  findOne(id: string) {
    return this.repository.getShopkeeperItem(id);
  }

  remove(id: string) {
    return this.repository.deleteShopkeeper(id);
  }
}
