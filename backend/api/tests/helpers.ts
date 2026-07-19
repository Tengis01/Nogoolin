import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { loadEnv, type Env } from '../src/config/env.js';
import { buildApp } from '../src/app.js';

// Load the monorepo root .env (written from `supabase start` output) without
// adding a dotenv dependency. Existing process env always wins.
export function loadRootEnv(): void {
  const path = resolve(import.meta.dirname, '../../../.env');
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return; // no .env — tests will be skipped by the reachability probe
  }
  for (const line of raw.split('\n')) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match && process.env[match[1]!] === undefined) {
      process.env[match[1]!] = match[2]!;
    }
  }
}

/** true when the local Supabase stack answers on SUPABASE_URL */
export async function stackReachable(): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  if (!url) return false;
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY ?? '' },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface TestContext {
  env: Env;
  app: Awaited<ReturnType<typeof buildApp>>;
  adminToken: string;
  customerToken: string;
  cleanup: () => Promise<void>;
}

// Provisions one admin + one customer against the LOCAL stack (auth admin
// API → role promotion via service client → password sign-in for JWTs).
export async function createTestContext(): Promise<TestContext> {
  const env = loadEnv();
  const service = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // bucket bootstrap (idempotent) — config.toml declares it for fresh
  // resets; tests must not depend on a restart having happened
  await service.storage
    .createBucket('product-images', { public: true })
    .catch(() => undefined);

  const password = `Test-${randomUUID()}`;
  const users: string[] = [];

  async function makeUser(role: 'admin' | 'customer'): Promise<string> {
    const email = `${role}-${randomUUID()}@test.nogoolin.mn`;
    const { data, error } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: `${role} test` },
    });
    if (error || !data.user) throw new Error(`test user create failed: ${error?.message}`);
    users.push(data.user.id);
    if (role === 'admin') {
      // same promotion path as the docs/09 §9 bootstrap (direct DB write)
      const { error: updateError } = await service
        .from('users')
        .update({ role: 'admin' })
        .eq('id', data.user.id);
      if (updateError) throw new Error(`role promotion failed: ${updateError.message}`);
    }
    const { data: session, error: signInError } = await anon.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError || !session.session) {
      throw new Error(`test sign-in failed: ${signInError?.message}`);
    }
    return session.session.access_token;
  }

  const adminToken = await makeUser('admin');
  const customerToken = await makeUser('customer');
  const app = await buildApp(env);

  return {
    env,
    app,
    adminToken,
    customerToken,
    cleanup: async () => {
      await app.close();
      for (const id of users) {
        await service.auth.admin.deleteUser(id).catch(() => undefined);
      }
    },
  };
}

// ── multipart body builder (no extra deps) ─────────────────────────────
export function buildMultipart(
  parts: Array<
    | { field: string; value: string }
    | { field: string; filename: string; contentType: string; data: Buffer }
  >,
): { payload: Buffer; contentType: string } {
  const boundary = `----test${randomUUID().replaceAll('-', '')}`;
  const chunks: Buffer[] = [];
  for (const part of parts) {
    chunks.push(Buffer.from(`--${boundary}\r\n`));
    if ('value' in part) {
      chunks.push(
        Buffer.from(
          `Content-Disposition: form-data; name="${part.field}"\r\n\r\n${part.value}\r\n`,
        ),
      );
    } else {
      chunks.push(
        Buffer.from(
          `Content-Disposition: form-data; name="${part.field}"; filename="${part.filename}"\r\n` +
            `Content-Type: ${part.contentType}\r\n\r\n`,
        ),
        part.data,
        Buffer.from('\r\n'),
      );
    }
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  return {
    payload: Buffer.concat(chunks),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

// Minimal valid 1×1 PNG (67 bytes)
export const TINY_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c626001000000ffff03000006000557bfabd40000000049454e44ae426082',
  'hex',
);
