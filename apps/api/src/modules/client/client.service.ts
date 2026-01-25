import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../config/supabase.config';
import {
  Database,
  CreateClientDto,
  UpdateClientDto,
  Client,
  PaginatedResponse,
  DatabaseUser,
  Invite,
  GetClientUsersAndInvitesResponseDto,
} from '@internal-cms/shared';
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
  isBefore,
} from 'date-fns';

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

    // Create support months for the client
    await this.manageSupportMonthsForClient(
      client.id,
      client.support_renewal_date,
      client.hours_per_month,
    );

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

    // Manage support months if renewal date was added or changed
    if (updateClientDto.support_renewal_date !== undefined) {
      await this.manageSupportMonthsForClient(
        client.id,
        client.support_renewal_date,
        client.hours_per_month,
      );
    }

    return client;
  }

  async getAllClients(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Client>> {
    // Ensure minimum values
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // Cap at 100 items per page
    const offset = (validPage - 1) * validLimit;

    // Build query with optional client filter
    const countQuery = this.supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const dataQuery = this.supabase
      .from('clients')
      .select<'*', Client>('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + validLimit - 1);

    // Get total count
    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new BadRequestException(
        `Failed to fetch client count: ${countError.message}`,
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / validLimit);

    // Get paginated data
    const { data: clients, error } = await dataQuery;

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

  async getClient(id: string, clientUid?: string | null): Promise<Client> {
    const { data: client, error } = await this.supabase
      .from('clients')
      .select<'*', Client>('*')
      .eq('id', id)
      .single();

    if (clientUid && client?.id !== clientUid) {
      throw new NotFoundException('Client not found');
    }

    if (error || !client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async getClientUsers(
    clientId: string,
  ): Promise<GetClientUsersAndInvitesResponseDto> {
    // First verify client exists
    const { data: client, error: clientError } = await this.supabase
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new NotFoundException('Client not found');
    }

    // Fetch users
    const { data: users, error: usersError } = await this.supabase
      .from('users')
      .select('*')
      .eq('client_uid', clientId)
      .order('created_at', { ascending: false });

    if (usersError) {
      throw new BadRequestException(
        `Failed to fetch client users: ${usersError.message}`,
      );
    }

    // Fetch invites for this client
    const { data: invites, error: invitesError } = await this.supabase
      .from('invites')
      .select('*')
      .eq('client_uid', clientId)
      .order('created_at', { ascending: false });

    if (invitesError) {
      throw new BadRequestException(
        `Failed to fetch client invites: ${invitesError.message}`,
      );
    }

    return {
      users: (users || []) as DatabaseUser[],
      invites: (invites || []) as Invite[],
    };
  }

  private async manageSupportMonthsForClient(
    clientId: string,
    supportRenewalDate: string | null,
    hoursPerMonth: number | null,
  ): Promise<void> {
    const startDate = startOfMonth(new Date());

    // If no renewal date, delete all future support months
    if (!supportRenewalDate) {
      const { error } = await this.supabase
        .from('client_support_months')
        .delete()
        .eq('client_id', clientId)
        .gte('date', format(startDate, 'yyyy-MM-dd'));

      if (error) {
        throw new BadRequestException(
          `Failed to delete support months: ${error.message}`,
        );
      }
      return;
    }

    const renewalDate = new Date(supportRenewalDate);
    const endDate = endOfMonth(renewalDate);

    // If renewal date is in the past, delete all future months
    if (isBefore(endDate, startDate)) {
      const { error } = await this.supabase
        .from('client_support_months')
        .delete()
        .eq('client_id', clientId)
        .gte('date', format(startDate, 'yyyy-MM-dd'));

      if (error) {
        throw new BadRequestException(
          `Failed to delete support months: ${error.message}`,
        );
      }
      return;
    }

    // Calculate cutoff date (first day of month after renewal date)
    const cutoffDate = format(
      startOfMonth(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1)),
      'yyyy-MM-dd',
    );

    // Delete any support months beyond the renewal date
    const { error: deleteError } = await this.supabase
      .from('client_support_months')
      .delete()
      .eq('client_id', clientId)
      .gte('date', cutoffDate);

    if (deleteError) {
      throw new BadRequestException(
        `Failed to delete support months: ${deleteError.message}`,
      );
    }

    // Generate months from current month to renewal date
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    // Check which months already exist
    const { data: existingMonths } = await this.supabase
      .from('client_support_months')
      .select('date')
      .eq('client_id', clientId);

    const existingDates = new Set(
      existingMonths?.map((m) => m.date.substring(0, 7)) || [],
    );

    // Create support months for months that don't exist
    const monthsToCreate = months
      .filter((month) => {
        const monthKey = format(month, 'yyyy-MM');
        return !existingDates.has(monthKey);
      })
      .map((month) => {
        return {
          client_id: clientId,
          date: format(startOfMonth(month), 'yyyy-MM-dd'),
          rolled_over_from_last_month: 0,
          rollover_hours: 0,
          spent_support_hours: 0,
          total_support_hours: hoursPerMonth || 0,
        };
      });

    if (monthsToCreate.length > 0) {
      const { error } = await this.supabase
        .from('client_support_months')
        .insert(monthsToCreate);

      if (error) {
        throw new BadRequestException(
          `Failed to create support months: ${error.message}`,
        );
      }
    }
  }
}
