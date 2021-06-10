import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  createUser(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    this.userService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    this.userService.remove(id);
  }

}