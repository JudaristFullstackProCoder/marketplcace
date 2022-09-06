import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto {
  @ApiProperty()
  name: string;
}
