import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {

  @UseGuards(LocalAuthGuard)
  @Get()
  async login(@Request() req) {
    return "Hello";
  }
}
