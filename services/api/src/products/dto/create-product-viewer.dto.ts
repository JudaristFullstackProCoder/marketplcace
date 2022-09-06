import { ApiProperty } from '@nestjs/swagger';

export class CreateProductViewerDto {
  constructor(userId: string, productId: string) {
    this.productId = productId;
    this.userId = userId;
  }
  @ApiProperty()
  userId: string;
  @ApiProperty()
  productId: string;
}
