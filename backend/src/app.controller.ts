import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Response } from 'express';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req, @Res() res: Response) {
    const user = await this.usersService.findOne(req.user.sub);
    return res.status(200).json(user);
  }
}
