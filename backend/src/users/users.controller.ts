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
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { User } from './entities/user.entity';

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
    return await this.usersService.findByName(login);
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
