import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductViewerDto } from './dto/create-product-viewer.dto';
import {
  ProductViewer,
  ProductViewerDocument,
} from './entities/product-viewers.entity';
import { remove__v_product_viewerCollection } from './product-viewer.transformer';

export class ProductViewersRepository {
  constructor(
    @InjectModel('products_viewers')
    readonly productViewerModel: Model<ProductViewerDocument>,
  ) {}
  async CreateProductViewer(
    productViewer: CreateProductViewerDto,
  ): Promise<ProductViewer | InternalServerErrorException> {
    try {
      return await new this.productViewerModel(productViewer).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteProductViewer(userId: string) {
    try {
      return (
        (await this.productViewerModel.findByIdAndDelete(userId)) ??
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
  async getProductViewsByUserId(
    userId: string,
  ): Promise<
    ProductViewerDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const product = await this.productViewerModel.find({
        user: userId,
      });
      if (!(product instanceof BadRequestException)) {
        if (!product) {
          return new NotFoundException();
        }
      }
      return remove__v_product_viewerCollection(product);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async checkViewerExistence(viewerId: string) {
    const result = await this.productViewerModel
      .findOne({
        user: viewerId,
      })
      .exec();
    if (!result) {
      return false;
    } else {
      return true;
    }
  }

  getModel() {
    return this.productViewerModel;
  }
}
