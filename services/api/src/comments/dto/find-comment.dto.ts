import { ApiProperty } from '@nestjs/swagger';

export class FindCommentDto {
  @ApiProperty()
  comment: string;
}
