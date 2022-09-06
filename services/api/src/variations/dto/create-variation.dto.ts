import { ApiProperty } from '@nestjs/swagger';

export class CreateVariationDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  product: string;
  shopkeeper: string;
}
