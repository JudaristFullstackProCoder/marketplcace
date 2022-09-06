import { ApiProperty } from '@nestjs/swagger';

export class FindCartDto {
  @ApiProperty()
  user: string;
}
