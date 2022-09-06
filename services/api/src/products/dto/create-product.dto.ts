import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  shortDescription: string;
  @ApiProperty()
  longDescription: string;
  shopkeeper: string;
  store: string;
}
