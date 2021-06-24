import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
