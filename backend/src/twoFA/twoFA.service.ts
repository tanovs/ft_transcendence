import { Injectable, Res } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFAService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFASecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.usersService.setTwoFASecret(secret, user.id);
    return otpauthUrl;
  }

  public async respondWithQRCode(data: string, @Res() response) {
    return toFileStream(response, data);
  }

  public isTwoFACodeValid(twoFACode: string, user: User) {
    return authenticator.verify({
      token: twoFACode,
      secret: user.twoFASecret,
    });
  }
}
