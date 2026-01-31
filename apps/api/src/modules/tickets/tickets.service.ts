import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../config/supabase.config';
import { Database } from '@internal-cms/shared';

export type TicketRow = Database['public']['Tables']['tickets']['Row'];

@Injectable()
export class TicketsService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = supabaseClient;
  }

  async getTicketsByClientId(clientId: string): Promise<TicketRow[]> {
    const { data: tickets, error } = await this.supabase
      .from('tickets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to fetch tickets: ${error.message}`,
      );
    }

    return tickets ?? [];
  }
}
