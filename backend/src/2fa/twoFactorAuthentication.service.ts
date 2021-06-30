import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    console.log(
      user.id +
        '\n' +
        user.login +
        '\n' +
        this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
    );
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl,
    };
  }

  public async respondWithQRCode(data: string, response: Response) {
    toFileStream(response, data);
  }
}
