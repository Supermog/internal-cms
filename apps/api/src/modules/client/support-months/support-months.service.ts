import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../../config/supabase.config';
import { Database } from '@internal-cms/shared';

export type SupportMonthRow =
  Database['public']['Tables']['client_support_months']['Row'];

@Injectable()
export class SupportMonthsService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = supabaseClient;
  }

  async getSupportMonths(
    clientId: string,
    year?: number,
  ): Promise<SupportMonthRow[]> {
    const { data: client, error: clientError } = await this.supabase
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new NotFoundException('Client not found');
    }

    const targetYear = year ?? new Date().getFullYear();
    const startDate = `${targetYear}-01-01`;
    const endDate = `${targetYear}-12-31`;

    const { data: supportMonths, error } = await this.supabase
      .from('client_support_months')
      .select('*')
      .eq('client_id', clientId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      throw new BadRequestException(
        `Failed to fetch support months: ${error.message}`,
      );
    }

    return supportMonths ?? [];
  }

  async addSupportHours(
    clientId: string,
    supportMonthId: string,
    hours: number,
  ): Promise<SupportMonthRow> {
    const { data: row, error: fetchError } = await this.supabase
      .from('client_support_months')
      .select('*')
      .eq('id', supportMonthId)
      .eq('client_id', clientId)
      .single();

    if (fetchError || !row) {
      throw new NotFoundException('Support month not found');
    }

    const currentSpent = row.spent_support_hours;
    const total = row.total_support_hours;
    const currentRollover = row.rollover_hours ?? 0;

    const newSpent = currentSpent + hours;

    let spentSupportHours: number;
    let rolloverHours: number;

    if (newSpent <= total) {
      spentSupportHours = newSpent;
      rolloverHours = currentRollover;
    } else {
      spentSupportHours = total;
      const excess = newSpent - total;
      rolloverHours = currentRollover + excess;
    }

    const { data: updated, error: updateError } = await this.supabase
      .from('client_support_months')
      .update({
        spent_support_hours: spentSupportHours,
        rollover_hours: rolloverHours,
      })
      .eq('id', supportMonthId)
      .eq('client_id', clientId)
      .select()
      .single();

    if (updateError) {
      throw new BadRequestException(
        `Failed to add support hours: ${updateError.message}`,
      );
    }

    return updated;
  }
}
