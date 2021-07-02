import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '60s',
      },
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService, ConfigService, AuthService],
  exports: [TwoFactorAuthenticationService],
})
export class TwoFactorAuthenticationModule {}
