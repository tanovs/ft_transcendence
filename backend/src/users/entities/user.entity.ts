import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    default: null,
    unique: true,
  })
  login: string;

  @Column()
  displayname: string;

  @Column({
    default: null,
  })
  twoFASecret: string;

  @Column({
    default: true,
  })
  isTwoFAEnabled: boolean;
}
