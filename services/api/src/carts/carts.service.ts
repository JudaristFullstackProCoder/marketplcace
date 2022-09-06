import { Inject, Injectable } from '@nestjs/common';
import { CartsRepository } from './cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(@Inject(CartsRepository) private repository: CartsRepository) {}
  create(createOptionDto: CreateCartDto) {
    return this.repository.addCart(createOptionDto);
  }

  findAll() {
    return this.repository.getAllCarts();
  }

  findOne(id: string) {
    return this.repository.getCartById(id);
  }

  find(filters: Record<string, any>) {
    return this.repository.getCartByFilters(filters);
  }

  update(id: string, updateOptionDto: UpdateCartDto) {
    return this.repository.updateCart(id, updateOptionDto);
  }

  remove(id: string) {
    return this.repository.deleteCart(id);
  }

  addProduct(CartId: string, productId: string) {
    return this.repository.addProduct(CartId, productId);
  }

  removeProduct(CartId: string, productId: string) {
    return this.repository.removeProduct(CartId, productId);
  }
}
