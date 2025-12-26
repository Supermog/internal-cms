import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AcceptInviteDto,
  SignInDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
  DatabaseUser,
  UserRole,
  DeleteUserResponseDto,
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

  @Patch('user/:id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<DatabaseUser> {
    const user = this.request.user;

    // Get the user to check authorization
    const existingUser = await this.authService.getDatabaseUserById(userId);

    if (
      user.role !== UserRole.ADMIN &&
      existingUser.client_uid !== user.client_uid
    ) {
      throw new ForbiddenException(
        'You are not authorized to update this user',
      );
    }

    return this.authService.updateUser(userId, updateUserDto);
  }

  @Delete('user/:id')
  async deleteUser(
    @Param('id') userId: string,
  ): Promise<DeleteUserResponseDto> {
    const user = this.request.user;

    // Get the user to check authorization
    const existingUser = await this.authService.getDatabaseUserById(userId);

    if (
      user.role !== UserRole.ADMIN &&
      existingUser.client_uid !== user.client_uid
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this user',
      );
    }

    await this.authService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }
}
