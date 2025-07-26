import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../config/supabase.config';
import { Database } from '@internal-cms/shared';
import { AcceptInviteDto } from '@internal-cms/shared';
import { InviteService } from './invite.service';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient<Database>;

  constructor(private inviteService: InviteService) {
    this.supabase = supabaseClient;
  }

  async signUpWithInvite(acceptInviteDto: AcceptInviteDto) {
    const { code, email, password, firstName, lastName } = acceptInviteDto;

    // First validate the invite
    const invite = await this.inviteService.validateInvite({ code, email });

    // Create user account with Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email since they're invited
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          invited_by: invite.created_by,
          invite_accepted_at: new Date().toISOString(),
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
    await this.inviteService.markInviteAsAccepted(invite.id, authData.user.id);

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName,
        lastName,
      },
      message: 'Account created successfully',
    };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
      },
      session: data.session,
    };
  }

  async getUser(userId: string) {
    const { data: user, error } =
      await this.supabase.auth.admin.getUserById(userId);

    if (error || !user.user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.user.id,
      email: user.user.email,
      firstName: user.user.user_metadata?.first_name,
      lastName: user.user.user_metadata?.last_name,
      createdAt: user.user.created_at,
    };
  }

  async deleteUser(userId: string) {
    const { error } = await this.supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }

    return { message: 'User deleted successfully' };
  }
}
