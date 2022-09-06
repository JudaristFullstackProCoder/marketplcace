import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductOptionDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  optionId: string;
}
