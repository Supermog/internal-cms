import {
  Controller,
  Get,
  Param,
  Query,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserRole, PaginatedResponse } from '@internal-cms/shared';
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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<TicketRow>> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== clientId) {
      throw new NotFoundException();
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.ticketsService.getTicketsByClientId(
      clientId,
      pageNum,
      limitNum,
    );
  }
}
