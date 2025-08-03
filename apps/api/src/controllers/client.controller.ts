import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ClientService } from '../services/client.service';
import {
  CreateClientDto,
  UpdateClientDto,
  Client,
  ClientResponseDto,
  PaginatedResponse,
} from '@internal-cms/shared';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
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
    return this.clientService.getClient(id);
  }
}
