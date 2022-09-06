import { ApiProperty } from '@nestjs/swagger';

export default class FileDeleteDto {
  @ApiProperty()
  filename: string;
}
