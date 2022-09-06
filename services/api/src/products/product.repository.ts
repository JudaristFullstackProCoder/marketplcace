import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModifyResult } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { remove__v_product } from './product.transformer';

export class ProductRepository {
  constructor(
    @InjectModel('products')
    readonly productModel: Model<ProductDocument>,
  ) {}
  async addProduct(
    product: CreateProductDto,
  ): Promise<Product | InternalServerErrorException> {
    try {
      return await new this.productModel(product).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteProduct(id: string) {
    try {
      return (
        (await this.productModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  paginationOptions(pageNum = 1, limit = 20) {
    return {
      page: pageNum,
      limit,
    };
  }
  search(q: string) {
    try {
      return this.productModel
        .find(
          {
            $text: {
              $search: q,
            },
          },
          {
            score: {
              $meta: 'textScore',
            },
          },
        )
        .sort({
          score: {
            $meta: 'textScore',
          },
        });
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getProductById(
    id: string,
  ): Promise<
    ProductDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const product = await this.productModel.findById(id);
      if (!(product instanceof BadRequestException)) {
        if (!product) {
          return new NotFoundException();
        }
      }
      return remove__v_product(product);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async updateProduct(id: string, product: UpdateProductDto) {
    try {
      return (
        (await this.productModel.findByIdAndUpdate(id, product)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async likeProduct(productId: string) {
    try {
      const p = await this.getProductById(productId);
      if (
        p instanceof NotFoundException ||
        p instanceof InternalServerErrorException
      ) {
        return p;
      }
      return (
        (await this.productModel
          .findByIdAndUpdate(productId, {
            likes: p.likes + 1,
          })
          .exec()) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async disLikeProduct(productId: string) {
    try {
      const p = await this.getProductById(productId);
      if (
        p instanceof NotFoundException ||
        p instanceof InternalServerErrorException
      ) {
        return p;
      }
      return (
        (await this.productModel
          .findByIdAndUpdate(productId, {
            likes: p.likes - 1,
          })
          .exec()) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getProductByFilters(
    filters: Record<string, unknown>,
  ): Promise<
    ProductDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const product = await this.productModel.find(filters);
      if (!(product instanceof BadRequestException)) {
        if (!product) {
          return new NotFoundException();
        }
      }
      return remove__v_product(product);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getAllProducts(): Promise<
    NotFoundException | InternalServerErrorException | ProductDocument[]
  > {
    try {
      return (await this.productModel.find()).map((e) => remove__v_product(e));
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addOption(
    productId: string,
    optionId: string,
    value: string,
  ): Promise<InternalServerErrorException | ModifyResult<ProductDocument>> {
    try {
      return (
        (await this.productModel.findOneAndUpdate(
          {
            _id: productId,
          },
          {
            $push: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              /* @ts-ignore */
              options: { option: optionId, value: value },
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeOption(
    productId: string,
    optionId: string, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<ProductDocument>> {
    try {
      return (
        (await this.productModel.findOneAndUpdate(
          {
            _id: productId,
          },
          {
            $pull: {
              options: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                /* @ts-ignore */
                option: optionId,
              },
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async updateOption(productId, optionId, value) {
    try {
      return (
        (await this.productModel.findOneAndUpdate(
          {
            _id: productId,
            'options.option': optionId,
          },
          {
            $set: {
              'options.$.value': value,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addImagesUrls(
    productId: string,
    image: Record<string, unknown>,
  ): Promise<InternalServerErrorException | ModifyResult<ProductDocument>> {
    try {
      return (
        (await this.productModel.findOneAndUpdate(
          {
            _id: productId,
          },
          {
            $push: {
              imagesUrls: image,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeImagesUrls(
    productId: string,
    image: Record<string, unknown>, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<ProductDocument>> {
    try {
      return (
        (await this.productModel.findOneAndUpdate(
          {
            _id: productId,
          },
          {
            $pull: {
              imagesUrls: image,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async setOrReplaceFeaturedImage(
    productId: string,
    newImage: Record<string, unknown>,
  ) {
    try {
      return await this.productModel
        .findByIdAndUpdate(productId, {
          imageUrl: newImage,
        })
        .exec();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async setOrReplaceFeaturedVideo(productId: string, newVideoUrl: string) {
    try {
      return await this.productModel
        .findByIdAndUpdate(productId, {
          videoUrl: newVideoUrl,
        })
        .exec();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  getModel() {
    return this.productModel;
  }
}
