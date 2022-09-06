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
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './entities/comment.entity';

export type AllCommentsOfaProduct = {
  userId?: string;
  productId?: string;
};

export type CommentByUser = {
  userId: string;
};

export type CommentByProduct = {
  productId: string;
};

@Injectable({ scope: Scope.DEFAULT })
export class CommentRepository {
  constructor(
    @InjectModel('comments') readonly commentModel: Model<CommentDocument>,
  ) {}
  async addComment(
    user: CreateCommentDto,
  ): Promise<Comment | InternalServerErrorException> {
    try {
      return await new this.commentModel(user).save();
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async deleteComment(id: string) {
    try {
      return (
        (await this.commentModel.findByIdAndDelete(id)) ??
        new NotFoundException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async updateComment(id: string, user: UpdateCommentDto) {
    try {
      return (
        (await this.commentModel.findByIdAndUpdate(id, user)) ??
        new NotImplementedException()
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getCommentById(
    id: string,
  ): Promise<
    CommentDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const comment = await this.commentModel.findById(id);
      if (!(comment instanceof BadRequestException)) {
        if (!comment) {
          return new NotFoundException();
        }
      }
      return comment;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getCommentByUser(
    userId: CommentByUser,
  ): Promise<
    CommentDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const comment = await this.commentModel.findOne(userId);
      if (!(comment instanceof BadRequestException)) {
        if (!comment) {
          return new NotFoundException();
        }
      }
      return comment;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getCommentByProduct(
    productId: CommentByProduct,
  ): Promise<
    CommentDocument | InternalServerErrorException | NotFoundException
  > {
    try {
      const comment = await this.commentModel.findOne(productId);
      if (!(comment instanceof BadRequestException)) {
        if (!comment) {
          return new NotFoundException();
        }
      }
      return comment;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  async getAllComments(
    filters: Record<string, unknown>,
  ): Promise<
    NotFoundException | InternalServerErrorException | CommentDocument[]
  > {
    try {
      return await this.commentModel.find(filters);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
  getModel() {
    return this.commentModel;
  }
}
