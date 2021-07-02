import { Body, Controller, Get, HttpService, Post, Query, Redirect, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { response } from 'express';

@Controller()
export class AppController {
  constructor(private authService: AuthService,
              private http: HttpService) {
  }

  UID = 'a584228fa2773785f54399fbeea9ee244b7055e1312a6852895fb194ba13ddde'
  secret = 'c57cd236e6453a746f1e4bc1753029f7841fb4290c5c75741697b912f63dd81d'

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('auth/42')
  @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=a584228fa2773785f54399fbeea9ee244b7055e1312a6852895fb194ba13ddde&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code')
  async login42() {
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Query('code') code: string) {
    console.log(code)
    const token = await this.http.post("https://api.intra.42.fr/oauth/token", {
      "grant_type":"client_credentials",
      "client_id":"a584228fa2773785f54399fbeea9ee244b7055e1312a6852895fb194ba13ddde",
      "client_secret":"c57cd236e6453a746f1e4bc1753029f7841fb4290c5c75741697b912f63dd81d",
      "code":"02bbeafb227283df12a792ffd27d42ee09ee7005eac8336e224357230fdced57",
      "redirect_uri":"http://localhost:3000"
    }).toPromise()
      .then(response => response.data);
    return token.access_token;
  }
}
