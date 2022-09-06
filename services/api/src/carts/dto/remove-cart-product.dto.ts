import { ApiProperty } from '@nestjs/swagger';

export class RemoveCartProductDto {
  @ApiProperty()
  cartId: string;
  @ApiProperty()
  productId: string;
}
