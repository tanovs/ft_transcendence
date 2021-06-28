import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  password: string;
}
