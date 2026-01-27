import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  UserRole,
  ManageSupportHoursDto,
  ManageSupportHoursAction,
} from '@internal-cms/shared';
import { AuthenticatedRequest } from '../../../types/authenticated-request.types';
import {
  SupportMonthsService,
  SupportMonthRow,
} from './support-months.service';

@Controller('clients/:clientId/support-months')
export class SupportMonthsController {
  constructor(
    private readonly supportMonthsService: SupportMonthsService,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  @Get()
  async getSupportMonths(
    @Param('clientId') clientId: string,
    @Query('year') year?: number,
  ): Promise<SupportMonthRow[]> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== clientId) {
      throw new NotFoundException();
    }

    return this.supportMonthsService.getSupportMonths(clientId, year);
  }

  @Patch(':id/:action')
  async manageSupportHours(
    @Param('clientId') clientId: string,
    @Param('id') id: string,
    @Param('action') action: ManageSupportHoursAction,
    @Body() dto: ManageSupportHoursDto,
  ): Promise<SupportMonthRow> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN) {
      throw new NotFoundException();
    }

    if (action === 'add') {
      return await this.supportMonthsService.addSupportHours(
        clientId,
        id,
        dto.hours,
      );
    } else if (action === 'remove') {
      return await this.supportMonthsService.removeSupportHours(
        clientId,
        id,
        dto.hours,
      );
    }

    throw new BadRequestException('Invalid action');
  }
}
