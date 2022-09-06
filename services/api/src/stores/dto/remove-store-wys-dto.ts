import { ApiProperty } from '@nestjs/swagger';

export class RemoveWysStoreDto {
  @ApiProperty()
  storeId: string;
  @ApiProperty()
  wysId: string;
}
