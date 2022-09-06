import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { VariationRepository } from './variation.repository';

@Injectable()
export class VariationsService {
  constructor(
    @Inject(VariationRepository)
    private variationRepository: VariationRepository,
  ) {}
  create(createVariationDto: CreateVariationDto) {
    return this.variationRepository.addProduct(createVariationDto);
  }

  findAll() {
    return this.variationRepository.getAllProducts();
  }

  findOne(id: string) {
    return this.variationRepository.getProductById(id);
  }

  find(filters: Record<string, unknown>) {
    return this.variationRepository.getProductByFilters(filters);
  }

  async addOrReaplaceImage(
    variationId: string,
    image: Record<string, unknown>,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(variationId, session);
    if (!ownership) {
      return ownership;
    }
    return await this.variationRepository
      .getModel()
      .findByIdAndUpdate(variationId, {
        image: { ...image },
      })
      .exec();
  }

  async update(
    id: string,
    updateVariationDto: UpdateVariationDto,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(id, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.variationRepository.updateProduct(id, updateVariationDto);
  }

  async remove(id: string, session: Record<string, unknown>) {
    const ownership = await this.checkOwnerShip(id, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.variationRepository.deleteProduct(id);
  }

  async addOption(
    variationId: string,
    optionId: string,
    value: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(variationId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.variationRepository.addOption(variationId, optionId, value);
  }

  async removeOption(
    variationId: string,
    optionId: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(variationId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.variationRepository.removeOption(variationId, optionId);
  }

  async updateOption(
    variationId: string,
    optionId: string,
    value: string,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(variationId, session);
    if (ownership !== true) {
      return ownership;
    }
    return this.variationRepository.updateOption(variationId, optionId, value);
  }

  async checkOwnerShip(variationId: string, session: Record<string, unknown>) {
    try {
      const variation = await this.variationRepository.getProductById(
        variationId,
      );
      if (
        variation instanceof InternalServerErrorException ||
        variation instanceof NotFoundException
      ) {
        return variation;
      }
      if (variation.shopkeeper !== session.shopkeeper['_id']) {
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
