import { Controller, Inject, Post, Delete, Body, Param } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  CreateInviteDto,
  ValidateInviteDto,
  ValidateInviteResponseDto,
  DeleteInviteResponseDto,
  Invite,
} from '@internal-cms/shared';
import { InviteService } from '../services/invite.service';
import { Request } from 'express';

@Controller('invites')
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async createInvite(
    @Body() createInviteDto: CreateInviteDto,
  ): Promise<Invite> {
    // In a real app, you'd extract user ID from JWT token
    // For now, we'll use a placeholder - you'll need to implement auth middleware
    const createdBy = 'system';

    const invite = await this.inviteService.createInvite(
      createInviteDto,
      createdBy,
    );
    return invite;
  }

  @Post('validate')
  async validateInvite(
    @Body() validateInviteDto: ValidateInviteDto,
  ): Promise<ValidateInviteResponseDto> {
    try {
      await this.inviteService.validateInvite(validateInviteDto);
      return { valid: true, message: 'Invite is valid' };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }

  @Delete(':id')
  async deleteInvite(
    @Param('id') inviteId: string,
  ): Promise<DeleteInviteResponseDto> {
    await this.inviteService.deleteInvite(inviteId);
    return { message: 'Invite deleted successfully' };
  }
}
