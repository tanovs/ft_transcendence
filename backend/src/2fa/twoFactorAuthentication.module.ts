import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFactorAuthenticationService, ConfigService],
  exports: [TwoFactorAuthenticationService],
})
export class TwoFactorAuthenticationModule {}
