import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserRole, AddSupportHoursDto } from '@internal-cms/shared';
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

  @Patch(':id')
  async addSupportHours(
    @Param('clientId') clientId: string,
    @Param('id') id: string,
    @Body() dto: AddSupportHoursDto,
  ): Promise<SupportMonthRow> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN) {
      throw new NotFoundException();
    }

    return await this.supportMonthsService.addSupportHours(
      clientId,
      id,
      dto.hours,
    );
  }
}
