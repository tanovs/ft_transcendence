import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  HttpStatus,
  HttpException, Req
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Response } from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@UseGuards(LocalAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('User created: ' + createUserDto.login);
    return new User(await this.usersService.create(createUserDto));
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':login')
  async findByName(@Param('login') login: string) {
    const user = new User(await this.usersService.findByName(login));
    if (!user.login) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User is not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    this.usersService.findOne(id).then(function (user) {
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json('User not found');
      } else {
        return res.status(HttpStatus.OK).json('deleted: ' + user.login);
      }
    });
    this.usersService.remove(id);
  }
}
