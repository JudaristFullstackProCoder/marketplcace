import { ApiProperty } from '@nestjs/swagger';

export class CreateProductLikeDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  productId: string;
}
