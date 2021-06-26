import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';

@Injectable()
export class AppService {
  constructor(private userService: UsersService) {
  }

  getHello(): Promise<User> {
    return this.userService.findByLogin('user');
  }
}
