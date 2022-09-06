import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModifyResult } from 'mongoose';
import { remove__v } from './cart.transformer';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './entities/cart.entity';

@Injectable()
export class CartsRepository {
  constructor(@InjectModel('carts') readonly cartModel: Model<CartDocument>) {}
  async addCart(
    cart: CreateCartDto,
  ): Promise<Cart | InternalServerErrorException> {
    try {
      return await new this.cartModel(cart).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteCart(id: string) {
    try {
      return (
        (await this.cartModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateCart(id: string, cart: UpdateCartDto) {
    try {
      return (
        (await this.cartModel.findByIdAndUpdate(id, cart)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getCartById(
    id: string,
  ): Promise<CartDocument | InternalServerErrorException | NotFoundException> {
    try {
      const cart = await this.cartModel.findById(id);
      if (!(cart instanceof BadRequestException)) {
        if (!cart) {
          return new NotFoundException();
        }
      }
      return remove__v(cart);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getCartByFilters(filters: Record<string, unknown>) {
    try {
      const cart = await this.cartModel.findOne(filters);
      if (!cart) {
        return new NotFoundException();
      }
      return remove__v(cart);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAllCarts(): Promise<
    NotFoundException | InternalServerErrorException | CartDocument[]
  > {
    try {
      return (await this.cartModel.find()).map((e) => remove__v(e));
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addProduct(
    CartId: string,
    productId: string,
  ): Promise<InternalServerErrorException | ModifyResult<CartDocument>> {
    try {
      return (
        (await this.cartModel.findOneAndUpdate(
          {
            _id: CartId,
          },
          {
            $push: {
              products: productId,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeProduct(
    CartId: string,
    productId: string, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<CartDocument>> {
    try {
      return (
        (await this.cartModel.findOneAndUpdate(
          {
            _id: CartId,
          },
          {
            $pull: {
              products: productId,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
