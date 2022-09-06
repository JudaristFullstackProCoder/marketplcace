import { ApiProperty } from '@nestjs/swagger';

export class AddUserSubscriptionDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  storeId: string;
}
