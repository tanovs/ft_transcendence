import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersDecorator } from './users/users.decorator';
import { User } from './users/entities/user.entity';
import JwtTwoFactorGuard from './auth/guards/jwt-two-factor.guard';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  //@UseGuards(JwtAuthGuard)
  @UseGuards(JwtTwoFactorGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.findOne(req.user.sub);
  }
}
