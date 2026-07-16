import { createBrowserClient } from '@supabase/ssr';

// Browser client — sessions live in cookies so Server Components and the
// middleware can read them (@supabase/ssr). Access token 15 min, refresh
// rotation: enforced server-side by GoTrue config (supabase/config.toml).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
