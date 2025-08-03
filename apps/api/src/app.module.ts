import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InviteController } from './controllers/invite.controller';
import { AuthController } from './controllers/auth.controller';
import { ClientController } from './controllers/client.controller';
import { InviteService } from './services/invite.service';
import { AuthService } from './services/auth.service';
import { ClientService } from './services/client.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [
    AppController,
    InviteController,
    AuthController,
    ClientController,
  ],
  providers: [AppService, InviteService, AuthService, ClientService],
})
export class AppModule {}
