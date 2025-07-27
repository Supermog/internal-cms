import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../config/supabase.config';
import {
  Database,
  AcceptInviteDto,
  SignUpResponseDto,
  AuthenticatedUserResponseDto,
} from '@internal-cms/shared';
import { InviteService } from './invite.service';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient<Database>;

  constructor(private inviteService: InviteService) {
    this.supabase = supabaseClient;
  }

  async signUpWithInvite(
    acceptInviteDto: AcceptInviteDto,
  ): Promise<SignUpResponseDto> {
    const { code, email, password, name } = acceptInviteDto;

    // First validate the invite
    const invite = await this.inviteService.validateInvite({ code, email });

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
      .single();

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
      .single();

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
}
