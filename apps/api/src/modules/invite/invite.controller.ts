import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import {
  CreateInviteDto,
  UpdateInviteDto,
  ValidateInviteResponseDto,
  DeleteInviteResponseDto,
  Invite,
  UserRole,
} from '@internal-cms/shared';
import { InviteService } from './invite.service';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from 'src/types/authenticated-request.types';
import { Public } from 'src/decorators/public.decorator';

@Controller('invites')
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

    if (
      user.role !== UserRole.ADMIN &&
      user.client_uid !== createInviteDto.client_uid
    ) {
      throw new ForbiddenException(
        'You are not authorized to create an invite',
      );
    }

    const invite = await this.inviteService.createInvite(
      createInviteDto,
      user.id,
    );

    return invite;
  }

  @Public()
  @Post('validate/:code')
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

  @Public()
  @Get('by-code/:code')
  async getInviteByCode(@Param('code') code: string): Promise<Invite> {
    return this.inviteService.getInviteByCode(code);
  }

  @Patch(':id')
  async updateInvite(
    @Param('id') inviteId: string,
    @Body() updateInviteDto: UpdateInviteDto,
  ): Promise<Invite> {
    const user = this.request.user;

    // Get the invite to check authorization
    const existingInvite = await this.inviteService.getInviteById(inviteId);

    if (
      user.role !== UserRole.ADMIN &&
      existingInvite.client_uid !== user.client_uid
    ) {
      throw new ForbiddenException(
        'You are not authorized to update this invite',
      );
    }

    return this.inviteService.updateInvite(inviteId, updateInviteDto);
  }

  @Delete(':id')
  async deleteInvite(
    @Param('id') inviteId: string,
  ): Promise<DeleteInviteResponseDto> {
    const user = this.request.user;

    // Get the invite to check authorization
    const existingInvite = await this.inviteService.getInviteById(inviteId);

    if (
      user.role !== UserRole.ADMIN &&
      existingInvite.client_uid !== user.client_uid
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this invite',
      );
    }

    await this.inviteService.deleteInvite(inviteId);
    return { message: 'Invite deleted successfully' };
  }
}
