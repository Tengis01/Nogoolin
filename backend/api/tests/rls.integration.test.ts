// RLS / column-privilege tests for direct Supabase access (NFR-SEC-350, C1).
// The web app writes public.users straight through supabase-js, so these
// talk to PostgREST with the customer's own JWT, bypassing the API.
// Runs against the LOCAL Supabase stack; self-skips when it is unreachable.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadEnv } from '../src/config/env.js';
import { createTestContext, loadRootEnv, stackReachable, type TestContext } from './helpers.js';

loadRootEnv();

const reachable = await stackReachable();

if (!reachable) {
  test('rls suite SKIPPED — local Supabase stack not running (run `pnpm exec supabase start`)', (t) =>
    t.skip());
} else {
  let ctx: TestContext;
  let customer: SupabaseClient;
  let customerId = '';
  const env = loadEnv();
  const service = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  async function storedProfile() {
    const { data, error } = await service
      .from('users')
      .select('role, email, full_name')
      .eq('id', customerId)
      .single();
    assert.ifError(error);
    return data;
  }

  before(async () => {
    ctx = await createTestContext();
    // JWT subject = the customer's auth.users id
    const payload = JSON.parse(
      Buffer.from(ctx.customerToken.split('.')[1]!, 'base64url').toString('utf8'),
    ) as { sub: string };
    customerId = payload.sub;
    customer = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${ctx.customerToken}` } },
    });
  });

  after(async () => {
    await ctx?.cleanup();
  });

  test('customer cannot promote own role to admin via Supabase (C1)', async () => {
    const { error } = await customer
      .from('users')
      .update({ role: 'admin' })
      .eq('id', customerId);
    assert.ok(error, 'role update must be rejected');
    assert.equal((await storedProfile()).role, 'customer');
  });

  test('customer cannot change own email via Supabase', async () => {
    const before = (await storedProfile()).email;
    const { error } = await customer
      .from('users')
      .update({ email: `hijack-${customerId}@test.nogoolin.mn` })
      .eq('id', customerId);
    assert.ok(error, 'email update must be rejected');
    assert.equal((await storedProfile()).email, before);
  });

  test('customer cannot insert orders directly while delivery is off (FR-SET-220)', async () => {
    const { error } = await customer.from('orders').insert({
      customer_id: customerId,
      customer_name: 'Тест',
      phone: '99112233',
      address: 'Улаанбаатар',
      total_amount: 1000,
    });
    // no grants on orders until the order feature ships (migration 0008), so
    // PostgREST rejects the statement before any row could be written
    assert.ok(error, 'direct order insert must be rejected');
    assert.equal(error.code, '42501');
  });

  test('customer can still update own full_name (profile form)', async () => {
    const { error } = await customer
      .from('users')
      .update({ full_name: 'Нэр Шинэчлэгдсэн' })
      .eq('id', customerId);
    assert.ifError(error);
    assert.equal((await storedProfile()).full_name, 'Нэр Шинэчлэгдсэн');
  });
}
