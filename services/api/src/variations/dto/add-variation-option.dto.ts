import { ApiProperty } from '@nestjs/swagger';

export class AddVariationOptionDto {
  @ApiProperty()
  variationId: string;
  @ApiProperty()
  optionId: string;
  @ApiProperty()
  value: string;
}
