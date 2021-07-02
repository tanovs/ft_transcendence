import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersDecorator } from './users/users.decorator';
import { User } from './users/entities/user.entity';
import JwtTwoFactorGuard from './auth/guards/jwt-two-factor.guard';
import RequestWithUser from './2fa/requestWithUser.interface';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  //@UseGuards(JwtAuthGuard)
  @UseGuards(JwtTwoFactorGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.findOne(req.user.sub);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth')
  // async login(@Req() req) {
  //   return this.authService.login(req.user);
  // }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Req() req) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(req.user);
    await this.usersService.setCurrentRefreshToken(refreshToken, req.user.id);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    if (req.user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    return req.user;
  }
}
