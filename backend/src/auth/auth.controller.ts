import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, Param,
  Post,
  Query,
  Redirect, Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import {Response} from "express";
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth/42')
export class AuthController {

  constructor(private authService: AuthService,
              private usersService: UsersService) {
  }

  @Get()
  redirect(@Query('code') code: string) {
    return code;
    // res.redirect(`http://localhost:8080/login?code=${code}`)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() request, @Res() response: Response) {
    const user = await this.usersService.findOne(request.user.sub)
    console.log(request)
    return response.status(200).json(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async get_user(@Req() request) {
    return request.user;
  }

  @Post('token')
  async callback(@Body() body: LoginDto, @Res() res: Response) {
    const code = body.code;
    let user = null;
    const fortyTwoUser = await this.authService.get42User(code);
    if (!fortyTwoUser) {
      throw new HttpException(
        {
          error: `42 user can't be found`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.authService.findUserFromLogin(fortyTwoUser.login)
    if (user === null) {
      let dto = new CreateUserDto()
        .set_displayname(fortyTwoUser.displayname)
        .set_login(fortyTwoUser.login)
        .set_email(fortyTwoUser.email);
      user = await this.usersService.create(dto);
    }
    const payload = {
      username: user.display_name,
      sub: user.id,
    }
    const access_token = await this.authService.generateToken(payload)
    const refresh_token = await this.authService.generateToken(payload, {
      expiresIn: `${60 * 60 * 24 * 30}s`
    })
    return res.status(200).json({
      access_token,
      refresh_token,
      expires_in: `${60 * 60 * 24 * 30}s`
    })
  }
}
