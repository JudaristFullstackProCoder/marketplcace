import { ApiProperty } from '@nestjs/swagger';

export class RemoveShopkeeperPerms {
  @ApiProperty()
  perms: string;
  @ApiProperty()
  shopkeeperId: string;
}
