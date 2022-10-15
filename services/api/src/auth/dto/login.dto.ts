import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  phonenumber: string;
  @ApiProperty()
  password: string;
}
