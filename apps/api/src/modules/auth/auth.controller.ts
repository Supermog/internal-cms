import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AcceptInviteDto,
  SignInDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '@internal-cms/shared';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from '../../types/authenticated-request.types';
import { Public } from '../../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  @Post('signup')
  @Public()
  async signUpWithInvite(
    @Body() acceptInviteDto: AcceptInviteDto,
  ): Promise<SignUpResponseDto> {
    return this.authService.signUpWithInvite(acceptInviteDto);
  }

  @Public()
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<AuthenticatedUserResponseDto> {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Public()
  @Get('user/:id')
  async getUser(
    @Param('id') userId: string,
  ): Promise<AuthenticatedUserResponseDto> {
    return this.authService.getUser(userId);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
