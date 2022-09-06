import { ApiProperty } from '@nestjs/swagger';
export class UpdateVariationDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
}
