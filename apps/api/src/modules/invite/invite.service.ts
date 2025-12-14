import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseClient } from '../../config/supabase.config';
import {
  Database,
  Invite,
  CreateInviteDto,
  InviteStatus,
} from '@internal-cms/shared';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InviteService {
  private supabase: SupabaseClient<Database>;

  constructor(private readonly mailService: MailService) {
    this.supabase = supabaseClient;
  }

  async createInvite(
    createInviteDto: CreateInviteDto,
    createdBy: string,
  ): Promise<Invite> {
    const { email, name, role, client_uid } = createInviteDto;

    /**
     * We need to list all users because we can't fetch by email
     */
    const { data: existingUsers } = await this.supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(
      (user: User) => user.email === email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if there's already a pending invite for this email
    const { data: existingInvite } = await this.supabase
      .from('invites')
      .select('*')
      .eq('email', email)
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

    // Send invite email first - if this fails, we don't create the invite
    await this.mailService.sendInviteEmail(email, code, name);

    // Email sent successfully, now create the invite
    const { data: invite, error } = await this.supabase
      .from('invites')
      .insert({
        email,
        name,
        created_by: createdBy,
        client_uid,
        code,
        role,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
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

  async validateInvite(code: string): Promise<Invite> {
    const { data: invite, error } = await this.supabase
      .from('invites')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !invite) {
      throw new NotFoundException('Invite is invalid');
    }

    // Check if invite has expired
    if (new Date(invite.expires_at) < new Date()) {
      // Mark as expired
      await this.supabase
        .from('invites')
        .update({ status: InviteStatus.EXPIRED })
        .eq('id', invite.id);

      throw new BadRequestException('Invite has expired');
    }

    // Check if invite is already accepted
    if (invite.status === InviteStatus.ACCEPTED) {
      throw new BadRequestException('Invite has already been accepted');
    }

    if (invite.status === InviteStatus.EXPIRED) {
      throw new BadRequestException('Invite has expired');
    }

    return invite;
  }

  async markInviteAsAccepted(inviteId: string): Promise<void> {
    const { error } = await this.supabase
      .from('invites')
      .update({
        status: InviteStatus.ACCEPTED,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', inviteId);

    if (error) {
      throw new BadRequestException(
        `Failed to update invite: ${error.message}`,
      );
    }
  }

  async deleteInvite(inviteId: string): Promise<void> {
    const { error } = await this.supabase
      .from('invites')
      .delete()
      .eq('id', inviteId);

    if (error) {
      throw new BadRequestException(
        `Failed to delete invite: ${error.message}`,
      );
    }
  }

  private generateInviteCode(): string {
    return uuidv4();
  }

  async getInviteByCode(code: string): Promise<Invite> {
    const { data: invite, error } = await this.supabase
      .from('invites')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !invite) {
      throw new NotFoundException('Invite not found');
    }

    return invite;
  }
}
