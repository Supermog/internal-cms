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
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  CreateClientDto,
  UpdateClientDto,
  Client,
  ClientResponseDto,
  PaginatedResponse,
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

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('You are not authorized to create a client');
    }

    return this.clientService.createClient(createClientDto);
  }

  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Get()
  async getAllClients(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedResponse<ClientResponseDto>> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.clientService.getAllClients(pageNum, limitNum);
  }

  @Get(':id')
  async getClient(@Param('id') id: string): Promise<ClientResponseDto> {
    const user = this.request.user;

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
}
