import { Controller, Get, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

export type ResponseApiController<
  ApiControllerResponseDataType,
  ApiControllerResponseMessageType,
> = {
  data?: ApiControllerResponseDataType;
  status: number;
  message?: ApiControllerResponseMessageType;
};

@ApiTags('Home Controller')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Record<string, unknown> {
    return this.appService.getHello();
  }

  @Get('session')
  getSession(@Session() session: Record<string, unknown>) {
    return session;
  }
}
