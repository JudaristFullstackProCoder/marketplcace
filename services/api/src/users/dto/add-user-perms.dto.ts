import { ApiProperty } from '@nestjs/swagger';

export class AddUserPermsDto {
  @ApiProperty()
  perms: string;
}
