import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  displayname: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  login: string

  set_displayname(displayname: string) {
    this.displayname = displayname
    return this
  }

  set_email(email: string) {
    this.email = email
    return this
  }

  set_login(login: string) {
    this.login = login
    return this
  }
}
