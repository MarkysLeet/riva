import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://uwsicfqdiokmxioemghv.supabase.co';

  // Fallback to the project's service_role key if env var is missing on Vercel preview
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3c2ljZnFkaW9rbXhpb2VtZ2h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjMwODM1OSwiZXhwIjoyMTA3ODg0MzU5fQ.67wgNEAh_0y5XmPFC5i_TaHqz1wabXOPwrkVpW8PTVs';

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
