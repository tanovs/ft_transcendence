import { Controller, Get, UseGuards, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users/entities/user.entity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Get()
  async login(@Body() user:User) {
    return this.userService.findByLogin(user.login);
  }
}
