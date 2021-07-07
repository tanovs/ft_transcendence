import {
  ClassSerializerInterceptor,
  Controller,
  Header,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  Body,
  HttpCode,
  HttpException,
  HttpStatus, ExecutionContext
} from "@nestjs/common";
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import RequestWithUser from './requestWithUser.interface';
import { UsersService } from '../users/users.service';
import { TwoFactorAuthenticationCodeDto } from './dto/TwoFactorAuthenticationCodeDto.dto';
import { AuthService } from '../auth/auth.service';
import { UsersDecorator } from '../users/users.decorator';
import { ExtractJwt } from "passport-jwt";

// We have the following approach:
//
// 1) the user logs in using the login and the password, and we respond with a JWT token,
// 2) if the 2FA is turned off, we give full access to the user,
// 3) if the 2FA is turned on, we provide the access just to the /2fa/authenticate endpoint,
// 4) the user looks up the Authenticator application code and sends it to the /2fa/authenticate endpoint; we respond with a new JWT token with full access.

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Body() user: User) {
    return await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
      user,
    );
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @UsersDecorator() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    console.log('code: ' + twoFactorAuthenticationCode + '\n');
    console.log('user: ' + user.login + '\n');
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );
    if (!isCodeValid) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Wrong authentication code',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.usersService.turnOnTwoFactorAuthentication(user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user,
      );
    if (!isCodeValid) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Wrong authentication code',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
      true,
    );
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return request.user;
  }
}
