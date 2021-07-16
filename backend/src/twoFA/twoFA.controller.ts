import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TwoFAService } from './twoFA.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { TwoFACodeDto } from './dto/TwoFACodeDto.dto';

// We have the following approach:
//
// 1) the user logs in using the login and the password, and we respond with a JWT token,
// 2) if the 2FA is turned off, we give full access to the user,
// 3) if the 2FA is turned on, we provide the access just to the /2fa/authenticate endpoint,
// 4) the user looks up the Authenticator application code and sends it to the /2fa/authenticate endpoint; we respond with a new JWT token with full access.

@Controller('2fa')
//@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFAController {
  constructor(
    private readonly twoFAService: TwoFAService,
    private readonly usersService: UsersService,
  ) {}

  @Post('generate')
  async register(@Req() request, @Res() response) {
    console.log(request);
    const user = await this.usersService.findOne(request.user.sub);
    if (user.isTwoFAEnabled) {
      const outputUrl = await this.twoFAService.generateTwoFASecret(user);
      return this.twoFAService.respondWithQRCode(outputUrl, response);
    }
    return response.status(200).json();
  }

  @Post('turn-on')
  async turnOnTwoFA(@Req() request, @Body() { twoFACode }: TwoFACodeDto) {
    console.log('code: ' + twoFACode + '\n');
    console.log('user: ' + request.user.sub + '\n');
    const isCodeValid = this.twoFAService.isTwoFACodeValid(
      twoFACode,
      request.user.sub,
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
    await this.usersService.turnOnTwoFA(request.user.sub);
  }

  @Post('authenticate')
  async authenticate(@Req() request, @Body() { twoFACode }: TwoFACodeDto) {
    const isCodeValid = this.twoFAService.isTwoFACodeValid(
      twoFACode,
      request.user.sub,
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
    return request.user;
  }
}
