import { ApiProperty } from '@nestjs/swagger';

export class AddCartProductDto {
  @ApiProperty()
  cartId: string;
  @ApiProperty()
  productId: string;
}
