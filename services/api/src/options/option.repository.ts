import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import {
  Option,
  OptionDocument,
  trimOptionCollectionDocument,
  trimOptionItemDocument,
} from './entities/option.entity';

@Injectable()
export class OptionRepository {
  constructor(
    @InjectModel('options') readonly optionModel: Model<OptionDocument>,
  ) {}
  async addOption(
    user: CreateOptionDto,
  ): Promise<Option | InternalServerErrorException> {
    try {
      return await new this.optionModel(user).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteOption(id: string) {
    try {
      return (
        (await this.optionModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateOption(id: string, user: UpdateOptionDto) {
    try {
      return (
        (await this.optionModel.findByIdAndUpdate(id, user)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getOptionItem(
    id: string,
  ): Promise<
    OptionDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const user = await this.optionModel.findById(id);
      if (!(user instanceof BadRequestException)) {
        if (!user) {
          return new NotFoundException();
        }
      }
      return trimOptionItemDocument(user);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getOneOptionItem(filters: Record<string, unknown>) {
    try {
      const user = await this.optionModel.findOne(filters);
      if (!user) {
        return new NotFoundException();
      }
      return trimOptionItemDocument(user);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getOptionCollection(
    id: string,
  ): Promise<
    OptionDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const user = await this.optionModel.findById(id);
      if (!(user instanceof BadRequestException)) {
        if (!user) {
          return new NotFoundException();
        }
      }
      return trimOptionCollectionDocument(user);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAllOptions(): Promise<
    NotFoundException | InternalServerErrorException | OptionDocument[]
  > {
    try {
      return (await this.optionModel.find()).map((e) =>
        trimOptionCollectionDocument(e),
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
