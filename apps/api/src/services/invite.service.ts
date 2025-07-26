import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../config/supabase.config';
import { Database, Invite } from '../types/database.types';
import { CreateInviteDto, ValidateInviteDto } from '../dto/invite.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class InviteService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = supabaseClient;
  }

  async createInvite(
    createInviteDto: CreateInviteDto,
    createdBy: string,
  ): Promise<Invite> {
    const { email } = createInviteDto;

    /**
     * We need to list all users because we can't fetch by email
     */
    const { data: existingUsers } = await this.supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(
      (user) => user.email === email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if there's already a pending invite for this email
    const { data: existingInvite } = await this.supabase
      .from('invites')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      throw new BadRequestException(
        'A pending invite already exists for this email',
      );
    }

    // Generate a unique invite code
    const code = this.generateInviteCode();

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: invite, error } = await this.supabase
      .from('invites')
      .insert({
        email,
        code,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        created_by: createdBy,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create invite: ${error.message}`,
      );
    }

    return invite;
  }

  async validateInvite(validateInviteDto: ValidateInviteDto): Promise<Invite> {
    const { code, email } = validateInviteDto;

    const { data: invite, error } = await this.supabase
      .from('invites')
      .select('*')
      .eq('code', code)
      .eq('email', email)
      .single();

    if (error || !invite) {
      throw new NotFoundException('Invalid invite code or email');
    }

    // Check if invite has expired
    if (new Date(invite.expires_at) < new Date()) {
      // Mark as expired
      await this.supabase
        .from('invites')
        .update({ status: 'expired' })
        .eq('id', invite.id);

      throw new BadRequestException('Invite has expired');
    }

    // Check if invite is already accepted
    if (invite.status === 'accepted') {
      throw new BadRequestException('Invite has already been accepted');
    }

    if (invite.status === 'expired') {
      throw new BadRequestException('Invite has expired');
    }

    return invite;
  }

  async markInviteAsAccepted(inviteId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('invites')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        user_id: userId,
      })
      .eq('id', inviteId);

    if (error) {
      throw new BadRequestException(
        `Failed to update invite: ${error.message}`,
      );
    }
  }

  async getInvitesByCreator(createdBy: string): Promise<Invite[]> {
    const { data: invites, error } = await this.supabase
      .from('invites')
      .select('*')
      .eq('created_by', createdBy)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to fetch invites: ${error.message}`,
      );
    }

    return invites || [];
  }

  async deleteInvite(inviteId: string, createdBy: string): Promise<void> {
    const { error } = await this.supabase
      .from('invites')
      .delete()
      .eq('id', inviteId)
      .eq('created_by', createdBy);

    if (error) {
      throw new BadRequestException(
        `Failed to delete invite: ${error.message}`,
      );
    }
  }

  private generateInviteCode(): string {
    return randomBytes(16).toString('hex').toUpperCase();
  }
}
