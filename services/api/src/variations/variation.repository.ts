import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModifyResult } from 'mongoose';
import { CreateVariationDto } from './dto/create-variation.dto';
import { UpdateVariationDto } from './dto/update-variation.dto';
import { VariationDocument } from './entities/variation.entity';

export class VariationRepository {
  constructor(
    @InjectModel('variations') public variationsModel: Model<string>,
  ) {}
  async addProduct(
    variation: CreateVariationDto,
  ): Promise<VariationDocument | InternalServerErrorException> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      return await new this.variationsModel(variation).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteProduct(id: string) {
    try {
      return (
        (await this.variationsModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getProductById(
    id: string,
  ): Promise<
    VariationDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const variation = await this.variationsModel.findById(id);
      if (!variation) {
        return new NotFoundException();
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      return variation;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async updateProduct(id: string, variation: UpdateVariationDto) {
    try {
      return (
        (await this.variationsModel.findByIdAndUpdate(id, variation)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getProductByFilters(
    filters: Record<string, unknown>,
  ): Promise<
    VariationDocument[] | InternalServerErrorException | NotFoundException
  > {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      const variation = await this.variationsModel.find(filters);
      if (!(variation instanceof BadRequestException)) {
        if (!variation) {
          return new NotFoundException();
        }
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      return variation;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getAllProducts(): Promise<
    NotFoundException | InternalServerErrorException | VariationDocument[]
  > {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      return (await this.variationsModel.find()).map((e) => e);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addOption(
    variationId: string,
    optionId: string,
    value: string,
  ): Promise<InternalServerErrorException | ModifyResult<VariationDocument>> {
    try {
      return (
        (await this.variationsModel.findOneAndUpdate(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          {
            _id: variationId,
          },
          {
            $push: {
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
    variationId: string,
    optionId: string, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<VariationDocument>> {
    try {
      return (
        (await this.variationsModel.findOneAndUpdate(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          {
            _id: variationId,
          },
          {
            $pull: {
              options: {
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

  async updateOption(variationId, optionId, value) {
    try {
      return (
        (await this.variationsModel.findOneAndUpdate(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          {
            _id: variationId,
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
    variationId: string,
    imageUrl: string,
  ): Promise<InternalServerErrorException | ModifyResult<VariationDocument>> {
    try {
      return (
        (await this.variationsModel.findOneAndUpdate(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          {
            _id: variationId,
          },
          {
            $push: {
              imagesUrls: imageUrl,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeImagesUrls(
    variationId: string,
    imageUrl: string, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<VariationDocument>> {
    try {
      return (
        (await this.variationsModel.findOneAndUpdate(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          /* @ts-ignore */
          {
            _id: variationId,
          },
          {
            $pull: {
              imagesUrls: imageUrl,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  getModel() {
    return this.variationsModel;
  }
}
