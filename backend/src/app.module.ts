import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from './auth/auth.service';
import { TwoFactorAuthenticationService } from './2fa/twoFactorAuthentication.service';
import { TwoFactorAuthenticationModule } from './2fa/twoFactorAuthentication.module';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    TwoFactorAuthenticationModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '60s',
      },
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    ChatGateway,
    TwoFactorAuthenticationService,
    ConfigService,
    //global interceptor for pass hiding instead of decorators repeat
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
