import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): Date {
    return new Date(-24 * 3600 * 1000);
  }
}
