import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, AdminDocument } from './entities/admin.entity';

@Injectable({ scope: Scope.DEFAULT })
export class AdminRepository {
  constructor(
    @InjectModel('admins') readonly adminModel: Model<AdminDocument>,
  ) {}
  async addAdmin(
    user: CreateAdminDto,
  ): Promise<Admin | InternalServerErrorException> {
    try {
      return await new this.adminModel(user).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteAdmin(id: string) {
    try {
      return (
        (await this.adminModel.findByIdAndDelete(id)) ?? new NotFoundException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateAdmin(id: string, user: UpdateAdminDto) {
    try {
      return (
        (await this.adminModel.findByIdAndUpdate(id, user)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAdminItem(
    id: string,
  ): Promise<AdminDocument | InternalServerErrorException | NotFoundException> {
    try {
      const admin = await this.adminModel.findById(id);
      if (!(admin instanceof BadRequestException)) {
        if (!admin) {
          return new NotFoundException();
        }
      }
      return admin;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAdminItemByFilters(
    filters: Record<string, unknown>,
  ): Promise<AdminDocument | InternalServerErrorException | NotFoundException> {
    try {
      const admin = await this.adminModel.findOne(filters);
      if (!(admin instanceof BadRequestException)) {
        if (!admin) {
          return new NotFoundException();
        }
      }
      return admin;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAdminCollection(
    id: string,
  ): Promise<AdminDocument | InternalServerErrorException | NotFoundException> {
    try {
      const user = await this.adminModel.findById(id);
      if (!(user instanceof BadRequestException)) {
        if (!user) {
          return new NotFoundException();
        }
      }
      return user;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAllAdmins(): Promise<
    NotFoundException | InternalServerErrorException | AdminDocument[]
  > {
    try {
      return (await this.adminModel.find()).map((e) => e);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  getModel() {
    return this.adminModel;
  }
}
