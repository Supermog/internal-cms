import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { InviteModule } from './modules/invite/invite.module';
import { ClientModule } from './modules/client/client.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccessGuard } from './guards/access.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    PassportModule,
    AuthModule,
    InviteModule,
    ClientModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
