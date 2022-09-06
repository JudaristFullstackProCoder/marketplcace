import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family, FamilyDocument } from './entities/family.entity';
import { remove_v } from './family.transformer';

@Injectable()
export class FamilyRepository {
  constructor(
    @InjectModel('families') readonly familyModel: Model<FamilyDocument>,
  ) {}
  async addFamily(
    family: CreateFamilyDto,
  ): Promise<Family | InternalServerErrorException> {
    try {
      return remove_v(await new this.familyModel(family).save());
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteFamily(id: string) {
    try {
      return (
        (await this.familyModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateFamily(id: string, family: UpdateFamilyDto) {
    try {
      return (
        (await this.familyModel.findByIdAndUpdate(id, family)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getFamilyItem(
    id: string,
  ): Promise<
    FamilyDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const family = await this.familyModel.findById(id);
      if (!(family instanceof BadRequestException)) {
        if (!family) {
          return new NotFoundException();
        }
      }
      return remove_v(family);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async findFamily(filters: Record<string, unknown>) {
    try {
      const family = await this.familyModel.findOne(filters);
      if (!family) {
        return new NotFoundException();
      }
      return remove_v(family);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getAllFamily(): Promise<
    NotFoundException | InternalServerErrorException | FamilyDocument[]
  > {
    try {
      return (await this.familyModel.find()).map((family) => remove_v(family));
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
