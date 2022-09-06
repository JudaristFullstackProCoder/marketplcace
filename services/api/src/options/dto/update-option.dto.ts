import { ApiProperty } from '@nestjs/swagger';

export class UpdateOptionDto {
  @ApiProperty()
  name: string;
}
