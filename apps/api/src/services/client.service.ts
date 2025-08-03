import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../config/supabase.config';
import {
  Database,
  CreateClientDto,
  UpdateClientDto,
  Client,
  ClientResponseDto,
  PaginatedResponse,
} from '@internal-cms/shared';

@Injectable()
export class ClientService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = supabaseClient;
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const { data: client, error } = await this.supabase
      .from('clients')
      .insert({
        name: createClientDto.name,
        short_name: createClientDto.short_name,
        support_level: createClientDto.support_level,
        key_contact_email: createClientDto.key_contact_email,
        key_contact_name: createClientDto.key_contact_name,
        is_covered_by_support: createClientDto.is_covered_by_support ?? true,
        is_monthly_checked: createClientDto.is_monthly_checked,
        is_proactive_support: createClientDto.is_proactive_support,
        hours_per_month: createClientDto.hours_per_month,
        support_renewal_date: createClientDto.support_renewal_date,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create client: ${error.message}`,
      );
    }

    return client;
  }

  async updateClient(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    // First check if client exists
    const { data: existingClient, error: existsError } = await this.supabase
      .from('clients')
      .select('id')
      .eq('id', id)
      .single();

    if (existsError || !existingClient) {
      throw new NotFoundException('Client not found');
    }

    const { data: client, error } = await this.supabase
      .from('clients')
      .update({
        ...(updateClientDto.name && { name: updateClientDto.name }),
        ...(updateClientDto.short_name && {
          short_name: updateClientDto.short_name,
        }),
        ...(updateClientDto.support_level && {
          support_level: updateClientDto.support_level,
        }),
        ...(updateClientDto.key_contact_email && {
          key_contact_email: updateClientDto.key_contact_email,
        }),
        ...(updateClientDto.key_contact_name && {
          key_contact_name: updateClientDto.key_contact_name,
        }),
        ...(updateClientDto.is_covered_by_support !== undefined && {
          is_covered_by_support: updateClientDto.is_covered_by_support,
        }),
        ...(updateClientDto.is_monthly_checked !== undefined && {
          is_monthly_checked: updateClientDto.is_monthly_checked,
        }),
        ...(updateClientDto.is_proactive_support !== undefined && {
          is_proactive_support: updateClientDto.is_proactive_support,
        }),
        ...(updateClientDto.hours_per_month !== undefined && {
          hours_per_month: updateClientDto.hours_per_month,
        }),
        ...(updateClientDto.support_renewal_date && {
          support_renewal_date: updateClientDto.support_renewal_date,
        }),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to update client: ${error.message}`,
      );
    }

    return client;
  }

  async getAllClients(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<ClientResponseDto>> {
    // Ensure minimum values
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // Cap at 100 items per page
    const offset = (validPage - 1) * validLimit;

    // Get total count
    const { count, error: countError } = await this.supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new BadRequestException(
        `Failed to fetch client count: ${countError.message}`,
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / validLimit);

    // Get paginated data
    const { data: clients, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + validLimit - 1);

    if (error) {
      throw new BadRequestException(
        `Failed to fetch clients: ${error.message}`,
      );
    }

    return {
      data: clients || [],
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        total_pages: totalPages,
      },
    };
  }

  async getClient(id: string): Promise<ClientResponseDto> {
    const { data: client, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }
}
