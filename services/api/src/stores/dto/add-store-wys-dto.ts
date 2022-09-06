import { ApiProperty } from '@nestjs/swagger';

export class AddWysStoreDto {
  @ApiProperty()
  storeId: string;
  @ApiProperty()
  wysId: string;
}
