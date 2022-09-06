import { ApiProperty } from '@nestjs/swagger';

export class FindProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  shortDescription: string;
  @ApiProperty()
  longDescription: string;
}
