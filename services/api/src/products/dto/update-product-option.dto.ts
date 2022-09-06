import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductOptionDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  optionId: string;
  @ApiProperty()
  value: string;
}
