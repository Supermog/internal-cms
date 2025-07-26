import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@internal-cms/shared';

const createSupabaseClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing required Supabase environment variables: SUPABASE_PROJECT_URL and SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

const supabaseClient = createSupabaseClient();

export { supabaseClient };
