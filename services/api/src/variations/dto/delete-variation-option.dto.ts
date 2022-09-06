import { ApiProperty } from '@nestjs/swagger';

export class DeleteVariationOptionDto {
  @ApiProperty()
  variationId: string;
  @ApiProperty()
  optionId: string;
}
