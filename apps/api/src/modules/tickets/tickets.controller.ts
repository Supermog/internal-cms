import {
  Controller,
  Get,
  Param,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserRole } from '@internal-cms/shared';
import { TicketRow, TicketsService } from './tickets.service';
import { AuthenticatedRequest } from '../../types/authenticated-request.types';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  @Get('client/:clientId')
  async getTicketsByClientId(
    @Param('clientId') clientId: string,
  ): Promise<TicketRow[]> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== clientId) {
      throw new NotFoundException();
    }

    return await this.ticketsService.getTicketsByClientId(clientId);
  }
}
