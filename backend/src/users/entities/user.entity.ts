import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  token: string;

  @Exclude()
  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
