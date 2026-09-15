// Integration tests for the Phase 4 soft-inquiry system + cart draft.
// Runs against the LOCAL Supabase stack (`supabase start`); the whole suite
// self-skips when the stack is unreachable, keeping `pnpm test` green offline.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from '../src/config/env.js';
import { buildApp } from '../src/app.js';
import { createTestContext, loadRootEnv, stackReachable, type TestContext } from './helpers.js';

loadRootEnv();
// Functional tests submit several inquiries from the same inject IP; raise the
// per-hour cap so they don't trip the 3/hr limit (that limit is exercised in a
// dedicated app instance below).
process.env.RATE_LIMIT_INQUIRY_MAX = '100';

const reachable = await stackReachable();

if (!reachable) {
  test('inquiry/cart suite SKIPPED — local Supabase stack not running (run `pnpm exec supabase start`)', (t) =>
    t.skip());
} else {
  let ctx: TestContext;
  const env = loadEnv();
  const service = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const runId = String(Date.now() % 1000000);
  let categoryId = '';
  let productId = ''; // published product for inquiries + cart
  let productSlug = '';
  const inquiryIds: string[] = []; // cleaned up in `after` (no DELETE policy → service_role)

  before(async () => {
    ctx = await createTestContext();
    // category + product via the admin API (draft first, to test cart's
    // published-only rule, then published)
    const cat = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/categories',
      headers: { authorization: `Bearer ${ctx.adminToken}` },
      payload: { name: `Асуулга тест ${runId}` },
    });
    categoryId = cat.json().data.id;

    const prod = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/admin/products',
      headers: { authorization: `Bearer ${ctx.adminToken}` },
      payload: { name: `Дарь эх ${runId}`, category_id: categoryId, price: 120000 },
    });
    productId = prod.json().data.id;
    productSlug = prod.json().data.slug;
  });

  after(async () => {
    // inquiries are append-only for clients; remove test rows via service_role
    for (const id of inquiryIds) {
      await service.from('inquiries').delete().eq('id', id);
    }
    // hard-delete the product, then the (now empty) category
    if (productId) {
      await ctx.app.inject({
        method: 'DELETE',
        url: `/api/v1/admin/products/${productId}?hard=true`,
        headers: { authorization: `Bearer ${ctx.adminToken}` },
      });
    }
    if (categoryId) {
      await ctx.app.inject({
        method: 'DELETE',
        url: `/api/v1/admin/categories/${categoryId}`,
        headers: { authorization: `Bearer ${ctx.adminToken}` },
      });
    }
    await ctx.cleanup(); // deletes test users → cart_items cascade
  });

  const admin = () => ({ authorization: `Bearer ${ctx.adminToken}` });
  const customer = () => ({ authorization: `Bearer ${ctx.customerToken}` });

  // ── Inquiry submission (FR-INQ-001..003) ──────────────────────

  test('POST /inquiries as guest → 201, status new, customer_id null', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      payload: { customer_name: 'Зочин Бат', phone: '99112233', message: 'Байгаа юу?', product_id: productId },
    });
    assert.equal(res.statusCode, 201);
    const inq = res.json().data;
    assert.equal(inq.status, 'new');
    assert.equal(inq.customer_id, null);
    assert.equal(inq.product_id, productId);
    inquiryIds.push(inq.id);
  });

  test('POST /inquiries authenticated → 201, links customer_id', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: customer(),
      payload: { customer_name: 'Нэвтэрсэн Дорж', phone: '88992211' },
    });
    assert.equal(res.statusCode, 201);
    const inq = res.json().data;
    assert.equal(inq.status, 'new');
    assert.notEqual(inq.customer_id, null); // linked to the authenticated user
    inquiryIds.push(inq.id);
  });

  test('POST /inquiries invalid body → 400; unknown product_id → 404', async () => {
    const invalid = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      payload: { customer_name: 'X', phone: 'abc' }, // name too short + bad phone
    });
    assert.equal(invalid.statusCode, 400);
    assert.equal(invalid.json().code, 'VALIDATION_ERROR');

    const badProduct = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      payload: {
        customer_name: 'Тест Хэрэглэгч',
        phone: '99001122',
        product_id: '00000000-0000-4000-8000-000000000000',
      },
    });
    assert.equal(badProduct.statusCode, 404);
    assert.equal(badProduct.json().code, 'PRODUCT_NOT_FOUND');
  });

  // ── Customer inquiry history (own-only, migration 0007) ────────

  test('GET /inquiries/mine → own only; anon → 401', async () => {
    const anon = await ctx.app.inject({ method: 'GET', url: '/api/v1/inquiries/mine' });
    assert.equal(anon.statusCode, 401);

    const res = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/inquiries/mine',
      headers: customer(),
    });
    assert.equal(res.statusCode, 200);
    const ids = res.json().data.map((i: { id: string }) => i.id);
    assert.ok(ids.includes(inquiryIds[1])); // the authenticated submission
    assert.ok(!ids.includes(inquiryIds[0])); // NOT the guest one
    assert.ok(res.json().data.every((i: { customer_id: string | null }) => i.customer_id !== null));
  });

  // ── Admin inbox (FR-INQ-004/006, FR-ADM-006) ──────────────────

  test('GET /admin/inquiries → data+meta newest-first; anon 401 / customer 403', async () => {
    const anon = await ctx.app.inject({ method: 'GET', url: '/api/v1/admin/inquiries' });
    assert.equal(anon.statusCode, 401);
    const cust = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/admin/inquiries',
      headers: customer(),
    });
    assert.equal(cust.statusCode, 403);

    const res = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/admin/inquiries',
      headers: admin(),
    });
    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.deepEqual(Object.keys(body.meta).sort(), ['limit', 'page', 'total', 'total_pages']);
    const ids = body.data.map((i: { id: string }) => i.id);
    assert.ok(ids.includes(inquiryIds[0]) && ids.includes(inquiryIds[1]));
    // newest first
    const times = body.data.map((i: { created_at: string }) => Date.parse(i.created_at));
    assert.deepEqual(times, [...times].sort((a, b) => b - a));
  });

  test('GET /admin/inquiries filters by status + product_id', async () => {
    const byStatus = await ctx.app.inject({
      method: 'GET',
      url: '/api/v1/admin/inquiries?status=new',
      headers: admin(),
    });
    assert.equal(byStatus.statusCode, 200);
    assert.ok(byStatus.json().data.every((i: { status: string }) => i.status === 'new'));

    const byProduct = await ctx.app.inject({
      method: 'GET',
      url: `/api/v1/admin/inquiries?product_id=${productId}`,
      headers: admin(),
    });
    assert.equal(byProduct.statusCode, 200);
    assert.ok(byProduct.json().data.every((i: { product_id: string }) => i.product_id === productId));
    assert.ok(byProduct.json().data.some((i: { id: string }) => i.id === inquiryIds[0]));
  });

  // ── Status update (FR-INQ-005) ────────────────────────────────

  test('PATCH /admin/inquiries/{id}/status → 200; unknown 404; customer 403', async () => {
    const ok = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/v1/admin/inquiries/${inquiryIds[0]}/status`,
      headers: admin(),
      payload: { status: 'contacted' },
    });
    assert.equal(ok.statusCode, 200);
    assert.equal(ok.json().data.status, 'contacted');

    const cust = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/v1/admin/inquiries/${inquiryIds[0]}/status`,
      headers: customer(),
      payload: { status: 'closed' },
    });
    assert.equal(cust.statusCode, 403);

    const missing = await ctx.app.inject({
      method: 'PATCH',
      url: '/api/v1/admin/inquiries/00000000-0000-4000-8000-000000000000/status',
      headers: admin(),
      payload: { status: 'closed' },
    });
    assert.equal(missing.statusCode, 404);
    assert.equal(missing.json().code, 'INQUIRY_NOT_FOUND');
  });

  // ── Rate limit (FR-INQ-007) — isolated app instance, max = 1 ───

  test('POST /inquiries rate limit → 429 after the cap', async () => {
    const rlApp = await buildApp({ ...loadEnv(), RATE_LIMIT_INQUIRY_MAX: 1 });
    const payload = { customer_name: 'Хязгаар Тест', phone: '99887766' };
    const first = await rlApp.inject({ method: 'POST', url: '/api/v1/inquiries', payload });
    assert.equal(first.statusCode, 201);
    inquiryIds.push(first.json().data.id);

    const second = await rlApp.inject({ method: 'POST', url: '/api/v1/inquiries', payload });
    assert.equal(second.statusCode, 429);
    assert.equal(second.json().code, 'RATE_LIMIT_EXCEEDED');
    await rlApp.close();
  });

  // ── Cart draft (Phase 4 wishlist) ─────────────────────────────

  test('cart routes require auth → 401 anon', async () => {
    for (const [method, url] of [
      ['GET', '/api/v1/cart'],
      ['POST', '/api/v1/cart'],
      ['DELETE', `/api/v1/cart/${productId}`],
    ] as const) {
      const res = await ctx.app.inject({ method, url, payload: {} });
      assert.equal(res.statusCode, 401, `${method} ${url}`);
    }
  });

  test('POST /cart draft product → 404 (published-only)', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/cart',
      headers: customer(),
      payload: { product_id: productId }, // still a draft at this point
    });
    assert.equal(res.statusCode, 404);
    assert.equal(res.json().code, 'PRODUCT_NOT_FOUND');
  });

  test('GET /cart empty; add published product (idempotent); remove', async () => {
    // publish the product first
    const pub = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/v1/admin/products/${productId}`,
      headers: admin(),
      payload: { status: 'published' },
    });
    assert.equal(pub.statusCode, 200);

    const empty = await ctx.app.inject({ method: 'GET', url: '/api/v1/cart', headers: customer() });
    assert.equal(empty.statusCode, 200);
    assert.equal(empty.json().data.length, 0);

    const add = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/cart',
      headers: customer(),
      payload: { product_id: productId },
    });
    assert.equal(add.statusCode, 201);
    assert.equal(add.json().data.product_id, productId);
    assert.equal(add.json().data.product.id, productId);
    assert.equal(add.json().data.product.status, 'published');

    // idempotent: adding again does not error or duplicate
    const again = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/cart',
      headers: customer(),
      payload: { product_id: productId },
    });
    assert.equal(again.statusCode, 201);

    const list = await ctx.app.inject({ method: 'GET', url: '/api/v1/cart', headers: customer() });
    assert.equal(list.json().data.length, 1);
    assert.equal(list.json().data[0].product.slug, productSlug);

    const del = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/cart/${productId}`,
      headers: customer(),
    });
    assert.equal(del.statusCode, 204);

    const afterDel = await ctx.app.inject({ method: 'GET', url: '/api/v1/cart', headers: customer() });
    assert.equal(afterDel.json().data.length, 0);

    // remove again is idempotent (still 204)
    const delAgain = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/v1/cart/${productId}`,
      headers: customer(),
    });
    assert.equal(delAgain.statusCode, 204);
  });

  test('POST /cart unknown product → 404', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/v1/cart',
      headers: customer(),
      payload: { product_id: '00000000-0000-4000-8000-000000000000' },
    });
    assert.equal(res.statusCode, 404);
    assert.equal(res.json().code, 'PRODUCT_NOT_FOUND');
  });
}
