import { Module } from '@nestjs/common';
import { TwoFAService } from './twoFA.service';
import { TwoFAController } from './twoFA.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '60s',
      },
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [TwoFAController],
  providers: [TwoFAService, ConfigService],
  exports: [TwoFAService],
})
export class TwoFAModule {}
