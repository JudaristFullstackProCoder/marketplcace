import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductViewerDto } from './dto/create-product-viewer.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ProductLikesRepository } from './products-like.repository';
import { ProductViewersRepository } from './products-viewers.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepository) private productRepository: ProductRepository,
    @Inject(ProductViewersRepository)
    private productViewersRepository: ProductViewersRepository,
    @Inject(ProductLikesRepository)
    private productLikesRepository: ProductLikesRepository,
  ) {}
  create(createCategoryDto: CreateProductDto) {
    return this.productRepository.addProduct(createCategoryDto);
  }

  findAll() {
    return this.productRepository.getAllProducts();
  }

  findOne(id: string) {
    return this.productRepository.getProductById(id);
  }

  find(filters: Record<string, unknown>) {
    return this.productRepository.getProductByFilters(filters);
  }

  async update(
    productId: string,
    updateCategoryDto: UpdateProductDto,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.updateProduct(productId, updateCategoryDto);
  }

  async remove(productId: string, session: Record<string, unknown>) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.deleteProduct(productId);
  }

  async addOption(
    productId: string,
    optionId: string,
    value: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.addOption(productId, optionId, value);
  }

  async removeOption(
    productId: string,
    optionId: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.removeOption(productId, optionId);
  }

  async updateOption(
    productId: string,
    optionId: string,
    value: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.updateOption(productId, optionId, value);
  }

  async addImagesUrls(
    productId: string,
    imageUrl: Record<string, unknown>,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.addImagesUrls(productId, imageUrl);
  }

  async setOrReplaceFeaturedImage(
    productId: string,
    image: Record<string, unknown>,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.setOrReplaceFeaturedImage(productId, image);
  }

  async setOrReplaceFeaturedVideo(
    productId: string,
    imageUrl: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.setOrReplaceFeaturedVideo(
      productId,
      imageUrl,
    );
  }

  async removeImagesUrls(
    productId: string,
    image: Record<string, unknown>,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(productId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.productRepository.removeImagesUrls(productId, image);
  }

  search(q: string) {
    return this.productRepository.search(q);
  }

  async likeProduct(userId: string, productId: string) {
    const alreadyLiked =
      await this.productLikesRepository.userAlreadyLikeProduct(
        userId,
        productId,
      );
    if (alreadyLiked) {
      return new UnauthorizedException(
        `product ${productId} already liked by user ${userId}`,
      );
    }
    const result = await this.productRepository.disLikeProduct(productId);
    if (
      result instanceof NotImplementedException ||
      result instanceof InternalServerErrorException ||
      result instanceof NotFoundException
    ) {
      return result;
    }
    return {
      message: `user ${userId} successfully like product: ${productId}`,
    };
  }

  async incrementProductViews(userId: string, productId: string) {
    if (userId) {
      const exist = await this.productViewersRepository.checkViewerExistence(
        userId,
      );
      if (!exist) {
        await this.productViewersRepository.CreateProductViewer(
          new CreateProductViewerDto(userId, productId),
        );
      }
    }
    const product = await this.productRepository.getProductById(productId);
    if (
      product instanceof NotFoundException ||
      product instanceof InternalServerErrorException
    ) {
      return product;
    }
    return this.productRepository
      .getModel()
      .findByIdAndUpdate(productId, {
        viewers: product.viewers + 1,
      })
      .exec();
  }

  async disLikeProduct(userId: string, productId: string) {
    const alreadyLiked =
      await this.productLikesRepository.userAlreadyLikeProduct(
        userId,
        productId,
      );
    if (!alreadyLiked) {
      return new UnauthorizedException(
        `user ${userId} has not liked by product ${productId}; user can not dislike product`,
      );
    }
    const result = await this.productRepository.likeProduct(productId);
    if (
      result instanceof NotImplementedException ||
      result instanceof InternalServerErrorException ||
      result instanceof NotFoundException
    ) {
      return result;
    }
    return {
      message: `user ${userId} successfully dislike product: ${productId}`,
    };
  }

  async checkOwnerShip(productId: string, session: Record<string, unknown>) {
    try {
      const product = await this.productRepository.getProductById(productId);
      if (
        product instanceof InternalServerErrorException ||
        product instanceof NotFoundException
      ) {
        return product;
      }
      if (product.shopkeeper !== session.shopkeeper['_id']) {
        return new UnauthorizedException(
          'Sorry, you are not the owner of this resource',
        );
      }
      return true;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
