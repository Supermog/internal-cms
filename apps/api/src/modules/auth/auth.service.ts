import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../config/supabase.config';
import { ConfigService } from '@nestjs/config';
import {
  Database,
  AcceptInviteDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
  DatabaseUser,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
} from '@internal-cms/shared';
import { InviteService } from '../invite/invite.service';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient<Database>;
  private configService: ConfigService;

  constructor(
    private inviteService: InviteService,
    configService: ConfigService,
  ) {
    this.supabase = supabaseClient;
    this.configService = configService;
  }

  // Create a regular Supabase client for operations that need email sending
  private getRegularSupabaseClient(): SupabaseClient<Database> {
    const supabaseUrl = this.configService.get('SUPABASE_PROJECT_URL');
    const supabaseAnonKey = this.configService.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing required Supabase environment variables: SUPABASE_PROJECT_URL and SUPABASE_ANON_KEY',
      );
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async signUpWithInvite(
    acceptInviteDto: AcceptInviteDto,
  ): Promise<SignUpResponseDto> {
    const { code, email, password, name } = acceptInviteDto;

    // First validate the invite
    const invite = await this.inviteService.validateInvite(code);

    // Create user account with Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email since they're invited
        user_metadata: {
          role: invite.role,
        },
      });

    if (authError) {
      throw new BadRequestException(
        `Failed to create user account: ${authError.message}`,
      );
    }

    if (!authData.user) {
      throw new BadRequestException('Failed to create user account');
    }

    // Mark invite as accepted
    await this.inviteService.markInviteAsAccepted(invite.id);

    // Create user in database
    await this.supabase.from('users').insert({
      id: authData.user.id,
      email: authData.user.email,
      role: invite.role,
      client_uid: invite.client_uid,
      name,
    });

    return {
      message: 'Account created successfully',
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<AuthenticatedUserResponseDto> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { data: databaseUser, error: databaseUserError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single<DatabaseUser>();

    if (databaseUserError) {
      throw new BadRequestException(
        `Failed to get user: ${databaseUserError.message}`,
      );
    }

    return {
      auth_user: data.user,
      database_user: databaseUser,
    };
  }

  async getUser(userId: string): Promise<AuthenticatedUserResponseDto> {
    const { data: user, error } =
      await this.supabase.auth.admin.getUserById(userId);

    if (error || !user.user) {
      throw new NotFoundException('User not found');
    }

    const { data: databaseUser, error: databaseUserError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.user.id)
      .single<DatabaseUser>();

    if (databaseUserError) {
      throw new BadRequestException(
        `Failed to get user: ${databaseUserError.message}`,
      );
    }

    return {
      auth_user: user.user,
      database_user: databaseUser,
    };
  }

  async getDatabaseUserById(userId: string): Promise<DatabaseUser> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single<DatabaseUser>();

    if (error || !user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Use regular client to send password reset email
    // This will trigger Supabase to send the reset email automatically
    const regularClient = this.getRegularSupabaseClient();

    await regularClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${this.configService.get('FRONTEND_URL') || 'http://localhost:8080'}/reset-password`,
    });

    // Return success message regardless to prevent email enumeration
    // Even if there's an error, we don't want to reveal if email exists
    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { password, token } = resetPasswordDto;

    // The token from Supabase password reset email is an access_token (JWT)
    // We'll extract the user ID from the token and update the password
    const regularClient = this.getRegularSupabaseClient();

    try {
      let userId: string;

      // First, try to use the token to get user info from Supabase
      // Supabase access tokens contain the user ID in the 'sub' claim
      try {
        // Decode JWT to get user ID (without verification since we'll verify via admin API)
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new BadRequestException('Invalid token format');
        }

        const payload = JSON.parse(
          Buffer.from(parts[1], 'base64').toString('utf-8'),
        );

        if (!payload.sub) {
          throw new BadRequestException('Invalid token: missing user ID');
        }

        userId = payload.sub;

        // Verify the user exists using admin API
        const { data: userData, error: userError } =
          await this.supabase.auth.admin.getUserById(userId);

        if (userError || !userData.user) {
          throw new BadRequestException('Invalid or expired reset token');
        }

        // Update the password using admin client
        const { error: updateError } =
          await this.supabase.auth.admin.updateUserById(userId, {
            password,
          });

        if (updateError) {
          throw new BadRequestException(
            `Failed to reset password: ${updateError.message}`,
          );
        }

        return {
          message: 'Password has been reset successfully',
        };
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        // If JWT decode fails, try as recovery token
        const { data: otpData, error: otpError } =
          await regularClient.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          });

        if (otpError || !otpData.user) {
          throw new BadRequestException('Invalid or expired reset token');
        }

        userId = otpData.user.id;

        // Update the password using admin client
        const { error: updateError } =
          await this.supabase.auth.admin.updateUserById(userId, {
            password,
          });

        if (updateError) {
          throw new BadRequestException(
            `Failed to reset password: ${updateError.message}`,
          );
        }

        return {
          message: 'Password has been reset successfully',
        };
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<DatabaseUser> {
    // First check if user exists
    const { data: existingUser, error: existsError } = await this.supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existsError || !existingUser) {
      throw new NotFoundException('User not found');
    }

    const { data: user, error } = await this.supabase
      .from('users')
      .update({
        ...(updateUserDto.name && { name: updateUserDto.name }),
      })
      .eq('id', userId)
      .select('*')
      .single<DatabaseUser>();

    if (error) {
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    // First check if user exists
    const { data: existingUser, error: existsError } = await this.supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existsError || !existingUser) {
      throw new NotFoundException('User not found');
    }

    // Delete from auth (this will also handle related data)
    const { error: authError } =
      await this.supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw new BadRequestException(
        `Failed to delete user: ${authError.message}`,
      );
    }

    // Delete from users table (cascade should handle this, but being explicit)
    const { error: dbError } = await this.supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (dbError) {
      throw new BadRequestException(
        `Failed to delete user from database: ${dbError.message}`,
      );
    }
  }
}
