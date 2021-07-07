import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private usersService: UsersService) {
  }

  @Get()
  @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=a584228fa2773785f54399fbeea9ee244b7055e1312a6852895fb194ba13ddde&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F42&response_type=code')
  async login42() {
  }

  @Get('code')
  async getCode(@Query('code') code: string) {
    return code;
  }

  @Get('42')
  async callback(@Query('code') code: string) {
    let user = null
    const fortyTwoUser = await this.authService.get42User(code)
    if (!fortyTwoUser) {
      throw new HttpException({
        error: `42 user can't be found`
      }, HttpStatus.BAD_REQUEST)
    }
    user = await this.authService.findUserFromLogin(fortyTwoUser.login)
    if (user === null) {
      let dto = new CreateUserDto()
        .set_displayname(fortyTwoUser.displayname)
        .set_login(fortyTwoUser.login)
        .set_email(fortyTwoUser.email)
      user = await this.usersService.create(dto)
    }
    const payload = {
      username: user.display_name,
      sub: user.id,
      role: user.role
    }
    const access_token = await this.authService.generateToken(payload)
    const refresh_token = await this.authService.generateToken(payload, {
      expiresIn: `${60 * 60 * 24 * 30}s`
    })
    return {
      access_token: access_token,
      refresh_token: refresh_token,
      expiresIn: '65000s'
    }
  }
}
