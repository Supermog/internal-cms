import { Controller, Post, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import {
  CreateInviteDto,
  ValidateInviteResponseDto,
  DeleteInviteResponseDto,
  Invite,
} from '@internal-cms/shared';
import { InviteService } from './invite.service';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from 'src/types/authenticated-request.types';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('invites')
@UseGuards(JwtAuthGuard)
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  @Post()
  async createInvite(
    @Body() createInviteDto: CreateInviteDto,
  ): Promise<Invite> {
    const user = this.request.user;

    const invite = await this.inviteService.createInvite(
      createInviteDto,
      user.id,
    );

    return invite;
  }

  @Post('validate/:code')
  @Public()
  async validateInvite(
    @Param('code') code: string,
  ): Promise<ValidateInviteResponseDto> {
    try {
      await this.inviteService.validateInvite(code);
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
