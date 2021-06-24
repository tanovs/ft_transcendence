import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Get()
  public index() {
    return 'Hello';
  }
}
