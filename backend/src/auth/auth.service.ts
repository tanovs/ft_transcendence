import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from "./constants";
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByName(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      console.log('Logged as ' + username);
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public getCookieWithJwtAccessToken(
    user: any,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: TokenPayload = {
      userName: user.username,
      userId: user.id,
      isSecondFactorAuthenticated,
    };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/;`;
  }

  public getCookieWithJwtRefreshToken(user: any) {
    const payload: { userId: number } = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.refresh_secret,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/;`;
    return {
      cookie,
      token,
    };
  }
}
