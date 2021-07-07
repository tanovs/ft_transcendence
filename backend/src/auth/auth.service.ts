import { HttpService, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private http: HttpService,
              private jwtService: JwtService) {}

  async findUserFromLogin(login: string): Promise<User | null> {
    const user = await this.usersService.findByLogin(login)
    if (user)
      return (user)
    return null;
  }

  async get42User(code: string): Promise<any | null> {
    const token = await this.http.post(`https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${process.env.APPLICATION_UID}&client_secret=${process.env.APPLICATION_SECRET}&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F42`)
      .toPromise()
      .then(response => response.data);
    const user = await this.http.get(`https://api.intra.42.fr/v2/me`,{
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }).toPromise().then(response => response.data)
    return user;
  }

  async generateToken(payload: any, args?: any): Promise<string> {
    return this.jwtService.sign(payload, args)
  }
}
