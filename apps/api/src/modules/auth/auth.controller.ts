import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AcceptInviteDto,
  SignInDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
} from '@internal-cms/shared';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from '../../types/authenticated-request.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

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

  @Get('user/:id')
  async getUser(
    @Param('id') userId: string,
  ): Promise<AuthenticatedUserResponseDto> {
    return this.authService.getUser(userId);
  }
}
