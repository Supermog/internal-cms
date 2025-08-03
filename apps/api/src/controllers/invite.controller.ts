import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  CreateInviteDto,
  ValidateInviteResponseDto,
  DeleteInviteResponseDto,
  Invite,
} from '@internal-cms/shared';
import { InviteService } from '../services/invite.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser, User } from '../decorators/user.decorator';

@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createInvite(
    @Body() createInviteDto: CreateInviteDto,
    @CurrentUser() user: User,
  ): Promise<Invite> {
    const { client_uid } = user;

    const invite = await this.inviteService.createInvite(
      createInviteDto,
      client_uid!,
    );
    return invite;
  }

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

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteInvite(
    @Param('id') inviteId: string,
  ): Promise<DeleteInviteResponseDto> {
    await this.inviteService.deleteInvite(inviteId);
    return { message: 'Invite deleted successfully' };
  }
}
