import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  CreateClientDto,
  UpdateClientDto,
  Client,
  ClientResponseDto,
  PaginatedResponse,
} from '@internal-cms/shared';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser, User } from '../../decorators/user.decorator';

@Controller('clients')
@UseGuards(AuthGuard) // Protect all client routes
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() user: User,
  ): Promise<Client> {
    if (user.role !== 'admin') {
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
  async getClient(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ClientResponseDto> {
    return this.clientService.getClient(id, user.client_uid);
  }
}
