import { Injectable } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findByLogin(login: string): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('user');
    return qb.where('user.login = :login', { login: login }).getOne();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async setTwoFASecret(secret: string, userId: number) {
    return this.userRepository.update(userId, {
      twoFASecret: secret,
    });
  }

  async turnOnTwoFA(userId: number) {
    return this.userRepository.update(userId, {
      isTwoFAEnabled: true,
    });
  }
}
