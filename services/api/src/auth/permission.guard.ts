import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
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
    const userperms: string[] = Object.values(
      request?.session?.user?.permissions[0] ?? {},
    );
    for (let i = 0; i < userperms.length; i++) {
      if (userperms[i] === permissions[0]) {
        return true;
      }
    }
    return false;
  }
}
