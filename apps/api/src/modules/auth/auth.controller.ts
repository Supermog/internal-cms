import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AcceptInviteDto,
  SignInDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
} from '@internal-cms/shared';
import { AuthGuard } from '../../guards/auth.guard';

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
  @UseGuards(AuthGuard)
  async getUser(
    @Param('id') userId: string,
  ): Promise<AuthenticatedUserResponseDto> {
    return this.authService.getUser(userId);
  }
}
