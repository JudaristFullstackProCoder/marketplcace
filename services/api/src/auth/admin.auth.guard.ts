// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminAuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const admin = request?.session?.admin;
    return !!admin;
  }
}
