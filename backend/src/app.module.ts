import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, AuthService, ChatGateway],
})
export class AppModule {}
