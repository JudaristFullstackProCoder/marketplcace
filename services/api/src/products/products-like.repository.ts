import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductLikeDto } from './dto/create-product-like.dto';
import {
  ProductLike,
  ProductLikeDocument,
} from './entities/product-like.entity';
import { remove__v_product_likeCollection } from './product-like.transformer';

export class ProductLikesRepository {
  constructor(
    @InjectModel('products_likes')
    readonly productLikeModel: Model<ProductLikeDocument>,
  ) {}
  async CreateProductLike(
    productViewer: CreateProductLikeDto,
  ): Promise<ProductLike | InternalServerErrorException> {
    try {
      return await new this.productLikeModel(productViewer).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteProductLike(userId: string) {
    try {
      return (
        (await this.productLikeModel.findByIdAndDelete(userId)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  /**
   * @param String userId
   * @returns Record<string, unknown>[] A list of all product that user with userId has seen
   */
  async getProductLikesByUserId(
    userId: string,
  ): Promise<
    ProductLikeDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const product = await this.productLikeModel.find({
        user: userId,
      });
      if (!(product instanceof BadRequestException)) {
        if (!product) {
          return new NotFoundException();
        }
      }
      return remove__v_product_likeCollection(product);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  /**
   * Check if a user has already like a given product to prevent a user to like the same product two time
   * @param String userId
   * @param String productId
   */
  async userAlreadyLikeProduct(userId: string, productId: string) {
    try {
      const i = await this.productLikeModel
        .findOne({
          user: userId,
          product: productId,
        })
        .exec();
      if (!i) {
        return false;
      }
      return true;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  getModel() {
    return this.productLikeModel;
  }
}
