import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AcceptInviteDto } from '@internal-cms/shared';

export class SignInDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUpWithInvite(@Body() acceptInviteDto: AcceptInviteDto) {
    return this.authService.signUpWithInvite(acceptInviteDto);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Get('user/:id')
  async getUser(@Param('id') userId: string) {
    return this.authService.getUser(userId);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.authService.deleteUser(userId);
  }
}
