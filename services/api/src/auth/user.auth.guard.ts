import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UsersRepository from '../users/users.repository';
import { Request } from 'express';

@Injectable()
export class UserAuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userWithToken = await this.usersRepository.getModel().findOne({
      token: request?.cookies?.token || '',
    });
    if (!userWithToken?.token) {
      return false;
    } else if (userWithToken?.token) {
      request.session['user'] = userWithToken;
      return true;
    }
    return false;
  }
}
