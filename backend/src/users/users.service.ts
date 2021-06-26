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
    // let result: CreateUserDto = createUserDto;
    // const saltOrRounds = 10;
    // const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    // result.login = createUserDto.login;
    // result.password = hash;
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findByUserName(username: string): Promise<User> {
    const qb = this.userRepository.createQueryBuilder('user');
    return qb.where('user.username = :username', { username: username }).getOne();
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

}
