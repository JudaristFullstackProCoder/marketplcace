import { ApiProperty } from '@nestjs/swagger';

export class UpdateVariationOptionDto {
  @ApiProperty()
  variationId: string;
  @ApiProperty()
  optionId: string;
  @ApiProperty()
  value: string;
}
