import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { USER_DEFAULTS_PERMISSIONS } from '../../auth/perms/user';

@Injectable()
export class UserPermissionPipe
  implements PipeTransform<string, string | BadRequestException>
{
  transform(permission: any) {
    return USER_DEFAULTS_PERMISSIONS[permission]
      ? permission
      : new BadRequestException('Invalid Permission');
  }
}
