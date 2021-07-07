import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
  }

  async findByName(login: string): Promise<User | null> {
    const qb = this.userRepository.createQueryBuilder('p');
    const user = qb.where('p.login = :login', { login: login }).getOne();
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.userRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.userRepository.update(userId, {
      is2faEnabled: true,
    });
  }

  async setAuthToken(authToken: string, id: number) {
    await this.userRepository.update(id, {
      authToken,
    });
  }

  async setCurrentRefreshToken(authToken: string, userId: number) {
    //const token = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      authToken,
    });
  }
}
