import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CommentByProduct,
  CommentByUser,
  CommentRepository,
} from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private repository: CommentRepository) {}
  create(user: CreateCommentDto) {
    return this.repository.addComment(user);
  }

  findAll(filters: Record<string, unknown>) {
    return this.repository.getAllComments(filters);
  }

  findOne(id: string) {
    return this.repository.getCommentById(id);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    session: Record<string, unknown>,
  ) {
    const ownership = await this.checkOwnerShip(id, session);
    if (!ownership) {
      return ownership;
    }
    return this.repository.updateComment(id, updateCommentDto);
  }

  async remove(id: string, session: Record<string, unknown>) {
    const ownership = await this.checkOwnerShip(id, session);
    if (!ownership) {
      return ownership;
    }
    return this.repository.deleteComment(id);
  }

  getCommentByUser(userId: CommentByUser) {
    return this.repository.getCommentByUser(userId);
  }

  getCommentByProduct(commentId: CommentByProduct) {
    return this.repository.getCommentByProduct(commentId);
  }

  async checkOwnerShip(commentId: string, session: Record<string, unknown>) {
    try {
      const comment = await this.repository.getCommentById(commentId);
      if (
        comment instanceof InternalServerErrorException ||
        comment instanceof NotFoundException
      ) {
        return comment;
      }
      if (comment.user !== session.user['_id']) {
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
