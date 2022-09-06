import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ShopkeeperPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.session.shopkeeper) {
      return false;
    }
    const shopkeeperperms: string[] = Object.values(
      request?.session?.shopkeeper?.permissions[0] ?? {},
    );
    for (let i = 0; i < shopkeeperperms.length; i++) {
      if (shopkeeperperms[i] === permissions[0]) {
        return true;
      }
    }
    return false;
  }
}
