import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InviteService } from '../services/invite.service';
import {
  CreateInviteDto,
  ValidateInviteDto,
  InviteResponseDto,
} from '@internal-cms/shared';
import { Request } from 'express';

@Controller('invites')
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  // @Post()
  // async createInvite(
  //   @Body(new ValidationPipe()) createInviteDto: CreateInviteDto,
  // ): Promise<InviteResponseDto> {
  //   // In a real app, you'd extract user ID from JWT token
  //   // For now, we'll use a placeholder - you'll need to implement auth middleware
  //   const createdBy = this.request.user?.id || 'system';

  //   const invite = await this.inviteService.createInvite(
  //     createInviteDto,
  //     createdBy,
  //   );
  //   return invite;
  // }

  // @Post('validate')
  // async validateInvite(
  //   @Body(new ValidationPipe()) validateInviteDto: ValidateInviteDto,
  // ): Promise<{ valid: boolean; message: string }> {
  //   try {
  //     await this.inviteService.validateInvite(validateInviteDto);
  //     return { valid: true, message: 'Invite is valid' };
  //   } catch (error) {
  //     return { valid: false, message: error.message };
  //   }
  // }

  // @Get()
  // async getMyInvites(@Request() req: any): Promise<InviteResponseDto[]> {
  //   // In a real app, you'd extract user ID from JWT token
  //   const createdBy = req.user?.id || 'system';

  //   const invites = await this.inviteService.getInvitesByCreator(createdBy);
  //   return invites;
  // }

  // @Delete(':id')
  // async deleteInvite(
  //   @Param('id') inviteId: string,
  //   @Request() req: any,
  // ): Promise<{ message: string }> {
  //   // In a real app, you'd extract user ID from JWT token
  //   const createdBy = req.user?.id || 'system';

  //   await this.inviteService.deleteInvite(inviteId, createdBy);
  //   return { message: 'Invite deleted successfully' };
  // }
}
