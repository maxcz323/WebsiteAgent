import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Used only in API routes (server-side). Never expose the service key to the browser.
let _admin: SupabaseClient | null = null;
function getAdmin(): SupabaseClient {
  if (!_admin) _admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  return _admin;
}

// Lazy proxy — createClient is not called at module load time (avoids build-time env errors)
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const client = getAdmin();
    const val = Reflect.get(client, prop, client);
    return typeof val === 'function' ? (val as (...a: unknown[]) => unknown).bind(client) : val;
  },
});
