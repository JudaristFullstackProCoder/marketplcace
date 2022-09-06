import { ApiProperty } from '@nestjs/swagger';

export class FindVariationDto {
  @ApiProperty()
  name: string;
}
