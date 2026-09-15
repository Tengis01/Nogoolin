import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';
import type { Env } from '../config/env.js';

// supabase-js's RealtimeClient requires a native WebSocket constructor
// unconditionally at createClient() time (Node 22+ has one; this API is
// pinned to node:20-alpine per NFR-MAIN-006 — do not relitigate that).
// This app never uses Realtime; the polyfill only exists to stop
// construction from throwing. Only assigns when missing so it's a no-op
// on Node 22+ (local dev host).
if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;
}

// Two client flavors per docs/phase-0/08 §6.2:
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
