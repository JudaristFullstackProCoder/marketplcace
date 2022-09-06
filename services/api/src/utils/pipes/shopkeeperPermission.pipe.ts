import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { SHOPKEEPER_DEFAULT_PERMS } from '../../auth/perms/shopkeeper';

@Injectable()
export class ShopkeeperPermissionPipe
  implements PipeTransform<string, string | BadRequestException>
{
  transform(permission: any) {
    return SHOPKEEPER_DEFAULT_PERMS[permission]
      ? permission
      : new BadRequestException('Invalid Permission');
  }
}
