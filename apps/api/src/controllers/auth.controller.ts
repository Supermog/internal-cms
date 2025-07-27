import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  AcceptInviteDto,
  SignInDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
} from '@internal-cms/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUpWithInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
  ): Promise<SignUpResponseDto> {
    return this.authService.signUpWithInvite(acceptInviteDto);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<AuthenticatedUserResponseDto> {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Get('user')
  async getUser(
    @Param('id') userId: string,
  ): Promise<AuthenticatedUserResponseDto> {
    return this.authService.getUser(userId);
  }
}
