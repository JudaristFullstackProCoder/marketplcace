import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModifyResult } from 'mongoose';
import { trimCategoryKeys } from './category.tansformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel('categories') readonly categoryModel: Model<CategoryDocument>,
  ) {}
  async addCategory(
    category: CreateCategoryDto,
  ): Promise<Category | InternalServerErrorException> {
    try {
      return trimCategoryKeys(await new this.categoryModel(category).save());
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteCategory(id: string) {
    try {
      return (
        (await this.categoryModel.findByIdAndDelete(id)) ??
        new BadRequestException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateCategory(id: string, category: UpdateCategoryDto) {
    try {
      return (
        (await this.categoryModel.findByIdAndUpdate(id, category)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getCategoryItem(
    id: string,
  ): Promise<
    CategoryDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const category = await this.categoryModel.findById(id);
      if (!(category instanceof BadRequestException)) {
        if (!category) {
          return new NotFoundException();
        }
      }
      return trimCategoryKeys(category);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async findCategory(filters: Record<string, unknown>) {
    try {
      const category = await this.categoryModel.findOne(filters);
      if (!category) {
        return new NotFoundException();
      }
      return trimCategoryKeys(category);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async getAllCategory(): Promise<
    NotFoundException | InternalServerErrorException | CategoryDocument[]
  > {
    try {
      return (await this.categoryModel.find()).map((category) =>
        trimCategoryKeys(category),
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addOption(
    categoryId: string,
    optionId: string,
  ): Promise<InternalServerErrorException | ModifyResult<CategoryDocument>> {
    try {
      return (
        (await this.categoryModel.findOneAndUpdate(
          {
            _id: categoryId,
          },
          {
            $push: {
              options: optionId,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeOption(
    categoryId: string,
    optionId: string, // never to skip error i don't no for what
  ): Promise<InternalServerErrorException | ModifyResult<CategoryDocument>> {
    try {
      return (
        (await this.categoryModel.findOneAndUpdate(
          {
            _id: categoryId,
          },
          {
            $pull: {
              options: optionId,
            },
          },
        )) ?? new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
