import { ApiProperty } from '@nestjs/swagger';

export class AddProductOptionDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  optionId: string;
  @ApiProperty()
  value: string;
}
