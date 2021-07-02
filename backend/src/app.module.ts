import { HttpModule, HttpService, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AuthModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
