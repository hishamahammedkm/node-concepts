import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('blocking')
  blocking() {
    return this.appService.blocking();
  }

  @Get('api-blocking')
  api2Blocking() {
    return this.appService.apiBlocking();
  }
  @Get('worker')
  async worker() {
    return this.appService.worker();
  }

  @Get('promises')
  async promises() {
    return this.appService.promises();
  }

  @Get('promisesParallel')
  async promisesParallel() {
    return this.appService.promisesParallel();
  }
}
