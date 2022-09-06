import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty()
  name: string;
}
