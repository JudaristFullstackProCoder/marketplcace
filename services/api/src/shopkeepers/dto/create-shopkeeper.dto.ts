import { ApiProperty } from '@nestjs/swagger';

export class CreateShopkeeperDto {
  @ApiProperty()
  user: string; // user id
}
