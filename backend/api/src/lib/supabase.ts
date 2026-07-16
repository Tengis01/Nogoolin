import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Env } from '../config/env.js';

// Two client flavors per docs/08 §6.2:
//
// 1. anon/authenticated client — used for ALL normal CRUD. When a user JWT
//    is forwarded, Postgres RLS is enforced with that user's auth.uid().
// 2. service_role client — bypasses RLS. Legitimate uses ONLY: audit-log
//    writes (UC-SYS-003). Never exposed beyond the repository layer.

export function createAnonClient(env: Env, accessToken?: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  });
}

export function createServiceClient(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
