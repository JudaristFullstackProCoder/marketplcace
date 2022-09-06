import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SuperAdminPermissionsGuard implements CanActivate {
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
    if (!request.session.super_admin) {
      return false;
    }
    const superAdminPerms: string[] = Object.values(
      request?.session?.super_admin?.permissions[0] ?? {},
    );
    for (let i = 0; i < superAdminPerms.length; i++) {
      if (superAdminPerms[i] === permissions[0]) {
        return true;
      }
    }
    return false;
  }
}
