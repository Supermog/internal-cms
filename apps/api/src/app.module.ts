import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InviteController } from './controllers/invite.controller';
import { AuthController } from './controllers/auth.controller';
import { InviteService } from './services/invite.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, InviteController, AuthController],
  providers: [AppService, InviteService, AuthService],
})
export class AppModule {}
