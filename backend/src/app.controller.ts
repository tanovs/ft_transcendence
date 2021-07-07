import {
  Controller,
  Get,
  HttpCode,
  HttpService,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TwoFactorAuthenticationService } from './2fa/twoFactorAuthentication.service';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly http: HttpService,
  ) {}

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  //@UseGuards(JwtTwoFactorGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.findOne(req.user.sub);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Req() request, @Res() response) {
    const authToken = await this.authService.login(request.user);
    console.log(authToken);
    await this.usersService.setAuthToken(authToken, request.user.id);
    const user = await this.usersService.findOne(request.user.id);
    if (user.is2faEnabled) {
      //Setting headers for authorization
      const headerDict = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };
      //Setting user data for request
      const body = JSON.stringify(user);
      //Getting Google Authenticator qrcode
      const outputUrl = await this.http
        .post('http://localhost:3000/2fa/generate', body, {
          headers: headerDict,
        })
        .toPromise()
        .then((res) => res.data);
      return this.twoFactorAuthenticationService.respondWithQRCode(
        outputUrl,
        response,
      );
    }
    return user;
  }

//   @HttpCode(200)
//   @UseGuards(LocalAuthGuard)
//   @Post('auth')
//   async login(@Req() req) {
//     const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
//       req.user,
//     );
//     console.log(accessTokenCookie);
//     const { cookie: refreshTokenCookie, token: refreshToken } =
//       this.authService.getCookieWithJwtRefreshToken(req.user);
//     await this.usersService.setCurrentRefreshToken(refreshToken, req.user.id);
//     req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
//     if (req.user.isTwoFactorAuthenticationEnabled) {
//       return;
//     }
//     return req.user;
//   }
}
