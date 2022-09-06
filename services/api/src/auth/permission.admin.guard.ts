import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminPermissionsGuard implements CanActivate {
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
    if (!request.session.admin) {
      return false;
    }
    const adminperms: string[] = Object.values(
      request?.session?.admin?.permissions[0] ?? {},
    );
    for (let i = 0; i < adminperms.length; i++) {
      if (adminperms[i] === permissions[0]) {
        return true;
      }
    }
    return false;
  }
}
