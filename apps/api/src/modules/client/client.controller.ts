import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
  ForbiddenException,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  CreateClientDto,
  UpdateClientDto,
  Client,
  PaginatedResponse,
  GetAllClientsQueryDto,
  UserRole,
  GetClientUsersAndInvitesResponseDto,
} from '@internal-cms/shared';
import { REQUEST } from '@nestjs/core';
import { AuthenticatedRequest } from 'src/types/authenticated-request.types';
import { supabaseClient } from 'src/config/supabase.config';

@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to create a client');
    }

    return this.clientService.createClient(createClientDto);
  }

  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== id) {
      throw new ForbiddenException(
        'You are not authorized to update this client',
      );
    }

    return this.clientService.updateClient(id, updateClientDto);
  }

  @Get()
  async getAllClients(
    @Query() query: GetAllClientsQueryDto,
  ): Promise<PaginatedResponse<Client>> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN) {
      throw new NotFoundException();
    }

    const { page, limit } = query;

    const pageNum = page || 1;
    const limitNum = limit || 10;

    return this.clientService.getAllClients(pageNum, limitNum);
  }

  @Get(':id')
  async getClient(@Param('id') id: string): Promise<Client> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== id) {
      throw new NotFoundException();
    }

    const { data: databaseUser } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!databaseUser) {
      throw new BadRequestException('User not found');
    }

    return this.clientService.getClient(id, databaseUser.client_uid);
  }

  @Get(':id/users')
  async getClientUsers(
    @Param('id') id: string,
  ): Promise<GetClientUsersAndInvitesResponseDto> {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== id) {
      throw new NotFoundException();
    }

    return this.clientService.getClientUsers(id);
  }

  @Get(':id/support-months')
  async getClientSupportMonths(
    @Param('id') id: string,
    @Query('year') year?: number,
  ) {
    const user = this.request.user;

    if (user.role !== UserRole.ADMIN && user.client_uid !== id) {
      throw new NotFoundException();
    }

    return this.clientService.getClientSupportMonths(id, year);
  }
}
