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
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersDecorator } from '../users/users.decorator';
import { User } from '../users/entities/user.entity';
import RequestWithUser from './requestWithUser.interface';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response, @Body() user: User) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user,
      );
    return this.twoFactorAuthenticationService.respondWithQRCode(
      otpauthUrl,
      response,
    );
  }
}
