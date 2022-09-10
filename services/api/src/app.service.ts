import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, unknown> {
    return {
      data: {},
      message: 'Hello World!',
      status: 200,
    };
  }
}
