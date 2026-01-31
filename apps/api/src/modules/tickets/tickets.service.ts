import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../config/supabase.config';
import { Database, PaginatedResponse } from '@internal-cms/shared';

export type TicketRow = Database['public']['Tables']['tickets']['Row'];

@Injectable()
export class TicketsService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = supabaseClient;
  }

  async getTicketsByClientId(
    clientId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<TicketRow>> {
    const validPage = Math.max(1, page);

    const validLimit = Math.max(1, Math.min(100, limit));

    const offset = (validPage - 1) * validLimit;

    const countQuery = this.supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    const dataQuery = this.supabase
      .from('tickets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .range(offset, offset + validLimit - 1);

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new BadRequestException(
        `Failed to fetch ticket count: ${countError.message}`,
      );
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / validLimit);

    const { data: tickets, error } = await dataQuery;

    if (error) {
      throw new BadRequestException(
        `Failed to fetch tickets: ${error.message}`,
      );
    }

    return {
      data: tickets ?? [],
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        total_pages: totalPages,
      },
    };
  }
}
