import { ApiProperty } from '@nestjs/swagger';

export class AddShopkeeperPerms {
  @ApiProperty()
  perms: string;
  @ApiProperty()
  shopkeeperId: string;
}
