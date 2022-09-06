import { ApiProperty } from '@nestjs/swagger';

export class RemoveUserSubscriptionDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  storeId: string;
}
